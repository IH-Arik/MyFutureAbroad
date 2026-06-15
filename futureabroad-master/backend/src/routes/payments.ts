import express from "express";
import { stripe, supabase, COMMISSION_PERCENTAGE } from "../config.js";
import { requireAuth } from "../requireAuth.js";
import { getDeduplicationKey, deduplicateRequest } from "../deduplication.js";

const router = express.Router();

// POST /api/payment/checkout
router.post("/checkout", requireAuth, async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId" });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, services(title), providers(company_name, preferred_currency)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.client_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user?.user?.email) {
      return res.status(404).json({ error: "User email not found" });
    }

    const commissionAmount = Math.round((order.amount * order.commission_percentage) / 100);

    // Use the order's currency for the checkout session
    const currency = (order.currency || "usd").toLowerCase();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: orderId,
      customer_email: user.user.email,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: order.services.title,
              description: `Service from ${order.providers.company_name}`,
            },
            unit_amount: order.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/orders?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/orders?payment=cancelled`,
      metadata: {
        orderId,
        userId,
        amount: order.amount,
        commission: commissionAmount,
      },
    });

    res.json({ sessionUrl: session.url });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/payment/checkout-request (deduplicated to prevent double-submit)
router.post("/checkout-request", requireAuth, async (req, res) => {
  try {
    const { amount, providerId, orderId, notes, currency } = req.body;
    const userId = req.userId;

    if (!amount || !providerId) {
      return res.status(400).json({ error: "Missing required fields: amount, providerId" });
    }

    // Deduplicate to prevent double-submission of payment requests
    const dedupeKey = getDeduplicationKey(userId, "POST", "/checkout-request", req.body);

    const result = await deduplicateRequest(dedupeKey, async () => {
      const { data: provider, error: providerError } = await supabase
        .from("providers")
        .select("company_name, id, preferred_currency")
        .eq("id", providerId)
        .single();

      if (providerError || !provider) {
        throw new Error("Provider not found");
      }

      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

      if (userError || !user?.user?.email) {
        throw new Error("User email not found");
      }

      const commissionAmount = Math.round((amount * COMMISSION_PERCENTAGE) / 100);

      // Use the specified currency or fall back to provider's preferred currency
      const paymentCurrency = (currency || provider.preferred_currency || "USD").toLowerCase();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: user.user.email,
        client_reference_id: orderId || userId,
        line_items: [
          {
            price_data: {
              currency: paymentCurrency,
              product_data: {
                name: "Service Payment",
                description: `Payment to ${provider.company_name}${notes ? ` - ${notes}` : ""}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/messages?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/messages?payment=cancelled`,
        metadata: {
          userId,
          providerId,
          amount,
          commission: commissionAmount,
          type: "payment_request",
          orderId: orderId || "none",
          currency: paymentCurrency,
        },
      });

      return {
        sessionId: session.id,
        sessionUrl: session.url,
        amount,
        commission: commissionAmount,
        providerReceives: amount - commissionAmount,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
