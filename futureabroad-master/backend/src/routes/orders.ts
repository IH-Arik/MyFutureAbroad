import express from "express";
import { stripe, supabase, COMMISSION_PERCENTAGE } from "../config.js";
import { requireAuth } from "../requireAuth.js";
import { isValidCurrency } from "../currency.js";
import { sanitizeError } from "../errorHandler.js";

const router = express.Router();

// POST /api/orders - Create payment request (provider)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { clientId, serviceId, providerId, amount, notes, threadId, currency } = req.body;
    const userId = req.userId;

    if (currency && !isValidCurrency(currency)) {
      return res.status(400).json({ error: `Unsupported currency: ${currency}` });
    }

    // Verify user is a member of the provider
    const { data: membership, error: memberError } = await supabase
      .from("provider_members")
      .select("id")
      .eq("user_id", userId)
      .eq("provider_id", providerId)
      .single();

    let hasAccess = false;

    if (!memberError && membership) {
      hasAccess = true;
    } else {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("provider_id")
        .eq("id", userId)
        .single();

      if (!profileError && profile && profile.provider_id === providerId) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return res.status(403).json({ error: "Not a member of this provider" });
    }

    // Ensure provider has Stripe connected before allowing payment requests
    const { data: providerInfo, error: providerInfoError } = await supabase
      .from("providers")
      .select("stripe_connect_account_id")
      .eq("id", providerId)
      .single();

    if (providerInfoError) {
      console.error("Failed to fetch provider info:", providerInfoError);
      return res.status(500).json({ error: "Failed to validate provider" });
    }

    if (!providerInfo?.stripe_connect_account_id) {
      return res.status(400).json({ error: "provider_no_stripe", message: "Provider must connect Stripe before receiving payments" });
    }

    // If threadId provided, validate thread exists and matches the parties
    if (threadId) {
      const { data: thread, error: threadError } = await supabase
        .from("message_threads")
        .select("id, client_id, provider_id")
        .eq("id", threadId)
        .single();

      if (threadError || !thread) {
        return res.status(404).json({ error: "Message thread not found" });
      }

      if (thread.client_id !== clientId || thread.provider_id !== providerId) {
        return res.status(403).json({ error: "Thread does not match client/provider" });
      }
    }

    const { data: orderData, error } = await supabase
      .from("orders")
      .insert({
        client_id: clientId,
        service_id: serviceId,
        provider_id: providerId,
        thread_id: threadId || null,
        amount: amount, // stored in cents
        notes: notes,
        status: "pending",
        payment_status: "pending",
        commission_percentage: COMMISSION_PERCENTAGE,
        currency: currency || "USD",
      })
      .select()
      .single();

    if (error) throw error;

    const paymentCurrency = (currency || "USD").toUpperCase();
    // Build currency symbol — use the full set of supported currencies
    const knownSymbols: Record<string, string> = {
      USD: "$", EUR: "€", GBP: "£", AUD: "A$", CAD: "C$",
      CHF: "CHF", SEK: "kr", NOK: "kr", DKK: "kr",
      PLN: "zł", CZK: "Kč", HUF: "Ft", RON: "lei",
      TRY: "₺", JPY: "¥", CNY: "¥", INR: "₹",
      ZAR: "R", SGD: "S$", HKD: "HK$",
    };
    const symbol = knownSymbols[paymentCurrency] || "$";

    if (threadId) {
      // Always insert a payment message so multiple requests can exist per thread.
      // Include the order ID so the frontend can match the message to the correct order.
      const { error: msgError } = await supabase
        .from("messages")
        .insert({
          thread_id: threadId,
          sender_id: userId,
          sender_type: "provider",
          body: `[ORDER:${orderData.id}] 💰 Payment Requested: ${symbol}${(amount / 100).toFixed(2)} ${paymentCurrency}\n\n${notes || "Please clear this payment so we can proceed with your service."}`,
        });

      if (msgError) {
        console.error(`[orders] Failed to insert payment message for order ${orderData.id}:`, msgError);
      }
    }

    res.status(201).json(orderData);
  } catch (err) {
    res.status(500).json({ error: sanitizeError(err) });
  }
});

// POST /api/orders/:orderId/accept - Provider accepts order and money transfers
router.post("/:orderId/accept", requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { data: membership } = await supabase
      .from("provider_members")
      .select("id")
      .eq("user_id", userId)
      .eq("provider_id", order.provider_id)
      .single();

    if (!membership) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("stripe_connect_account_id, preferred_currency")
      .eq("id", order.provider_id)
      .single();

    if (providerError || !provider?.stripe_connect_account_id) {
      return res.status(400).json({ error: "Provider has no connected bank account" });
    }

    // Ensure order is paid and has an associated Stripe payment intent
    if (order.payment_status !== "paid") {
      return res.status(400).json({ error: "Order must be paid before accepting" });
    }

    if (!order.stripe_payment_intent_id) {
      return res.status(400).json({ error: "Missing stripe payment intent on order" });
    }

    if (order.status === "active") {
      return res.status(400).json({ error: "Order is already active" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ error: "Order has been cancelled" });
    }

    // Retrieve the PaymentIntent and the underlying Charge to use the actual settled
    // amount and currency for the transfer. This avoids currency mismatches where
    // the order.recorded currency differs from the captured charge.
    const paymentIntent = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id as string);
    const latestChargeRef = paymentIntent.latest_charge;
    const chargeId = typeof latestChargeRef === "string"
      ? latestChargeRef
      : latestChargeRef?.id || (paymentIntent as any).charges?.data?.[0]?.id;

    if (!chargeId) {
      return res.status(400).json({ error: "No charge found for this payment intent" });
    }

    const charge = await stripe.charges.retrieve(chargeId);

    // CRITICAL: When using source_transaction, the transfer currency MUST exactly
    // match the charge's currency. The charge's balance_transaction settles in the
    // *platform's* settlement currency, which may differ from the charge's currency.
    // Using the balance_transaction currency here would cause Stripe to reject the
    // transfer with "must not exceed the source amount" errors.
    const chargeCurrency = (charge.currency || paymentIntent.currency || "usd").toString().toLowerCase();

    // Use the actual settled charge amount when calculating provider transfer and commission
    const sourceAmount = typeof charge.amount === "number" ? charge.amount : order.amount;
    const commissionPercent = order.commission_percentage ?? COMMISSION_PERCENTAGE ?? 10;
    const commissionAmount = Math.round((sourceAmount * commissionPercent) / 100);
    const transferAmount = Math.max(0, sourceAmount - commissionAmount);

    // Log diagnostic info so we can debug currency mismatches in the future
    console.info(`[orders] Transfer debug: order=${orderId}`, {
      charge_currency: charge.currency,
      payment_intent_currency: paymentIntent.currency,
      order_currency: order.currency,
      provider_preferred_currency: provider.preferred_currency,
      balance_transaction: charge.balance_transaction,
      chargeCurrency,
      sourceAmount,
      commissionAmount,
      transferAmount,
    });

    // Create transfer referencing the original charge. Currency must match the source transaction.
    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: chargeCurrency,
      destination: provider.stripe_connect_account_id,
      source_transaction: chargeId,
      metadata: { orderId },
    });

    // Persist the transfer and canonicalize the order amount/currency to the settled charge
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "active",
        stripe_transfer_id: transfer.id,
        amount: sourceAmount,
        currency: (chargeCurrency || "usd").toUpperCase(),
      })
      .eq("id", orderId);

    if (updateError) {
      return res.status(500).json({ error: "Failed to update order" });
    }

    res.json({ success: true, transfer_id: transfer.id });
  } catch (err) {
    console.error("Accept order error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/orders/:orderId/reject - Provider rejects order and client is refunded
router.post("/:orderId/reject", requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { data: membership } = await supabase
      .from("provider_members")
      .select("id")
      .eq("user_id", userId)
      .eq("provider_id", order.provider_id)
      .single();

    if (!membership) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Validate: only reject paid (not already refunded/cancelled) orders
    if (order.payment_status !== "paid") {
      return res.status(400).json({ error: "Only paid orders can be rejected and refunded" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    if (!order.stripe_payment_intent_id) {
      return res.status(400).json({ error: "No payment to refund" });
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        payment_status: "refunded",
      })
      .eq("id", orderId);

    if (updateError) {
      return res.status(500).json({ error: "Failed to update order" });
    }

    res.json({ success: true, refund_id: refund.id });
  } catch (err) {
    console.error("Reject order error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/orders/:orderId/cancel - Provider cancels a pending payment request (no refund needed)
router.post("/:orderId/cancel", requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only allow cancelling pending (unpaid) orders that aren't already cancelled
    if (order.payment_status !== "pending") {
      return res.status(400).json({ error: "Only pending payment requests can be cancelled" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    const { data: membership } = await supabase
      .from("provider_members")
      .select("id")
      .eq("user_id", userId)
      .eq("provider_id", order.provider_id)
      .single();

    if (!membership) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        payment_status: "cancelled",
      })
      .eq("id", orderId);

    if (updateError) {
      return res.status(500).json({ error: "Failed to update order" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/orders/:orderId/invoice - Get invoice URL for a paid order
router.get("/:orderId/invoice", requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify user is either the client OR a member of the provider on this order
    let authorized = order.client_id === userId;
    if (!authorized) {
      const { data: membership } = await supabase
        .from("provider_members")
        .select("id")
        .eq("user_id", userId)
        .eq("provider_id", order.provider_id)
        .maybeSingle();
      if (membership) {
        authorized = true;
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("provider_id")
          .eq("id", userId)
          .maybeSingle();
        if (profile?.provider_id === order.provider_id) authorized = true;
      }
    }
    if (!authorized) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (order.payment_status !== "paid" || !order.stripe_payment_intent_id) {
      return res.status(400).json({ error: "No invoice available for this order" });
    }

    // Retrieve payment intent from Stripe and then fetch the latest charge explicitly.
    const paymentIntent = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id);
    const latestCharge = paymentIntent.latest_charge;

    if (!latestCharge) {
      return res.status(404).json({ error: "Charge information not found" });
    }

    const chargeId = typeof latestCharge === "string" ? latestCharge : latestCharge.id;
    const charge = await stripe.charges.retrieve(chargeId);

    // Retrieve invoice from Stripe if it exists
    let invoiceUrl = null;
    if (charge.invoice) {
      try {
        const invoiceId = typeof charge.invoice === "string" ? charge.invoice : charge.invoice.id;
        const invoice = await stripe.invoices.retrieve(invoiceId);
        invoiceUrl = invoice.hosted_invoice_url;
      } catch (err) {
        console.error("Failed to retrieve invoice:", err);
      }
    }

    // If no hosted invoice URL, generate a receipt using the charge
    // For now, return the charge info and let the frontend handle display
    res.json({
      success: true,
      invoiceUrl,
      chargeId: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      created: charge.created,
      description: charge.description,
      receiptUrl: charge.receipt_url, // Stripe also provides a receipt URL
    });
  } catch (err) {
    console.error("Get invoice error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
