import express from "express";
import { stripe, supabase } from "../config.js";

const router = express.Router();

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn("⚠️  STRIPE_WEBHOOK_SECRET not set — webhook signature verification disabled");
}

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  // Verify signature is present
  if (!sig) {
    console.error("[webhook] Missing stripe-signature header");
    return res.status(401).json({ error: "Missing signature" });
  }

  // Verify webhook secret is configured
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", (err as Error).message);
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.client_reference_id;

      if (!orderId) {
        console.error("[webhook] Session has no client_reference_id");
        return res.json({ received: true });
      }

      // Check if order is already paid (idempotency)
      const { data: order } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("id", orderId)
        .single();

      if (order?.payment_status === "paid") {
        console.warn(`[webhook] Order ${orderId} already marked as paid, skipping update`);
        return res.json({ received: true });
      }

      // If we have a payment_intent id on the session, retrieve the PaymentIntent
      let paymentIntentCurrency: string | undefined = undefined;
      if (session.payment_intent) {
        try {
          const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string);
          paymentIntentCurrency = pi.currency ? (pi.currency as string).toUpperCase() : undefined;
        } catch (err) {
          console.error(`[webhook] Failed to retrieve paymentIntent ${session.payment_intent}:`, err);
        }
      }

      // Update order with payment details and captured currency when available
      const updatePayload: any = {
        payment_status: "paid",
        stripe_payment_intent_id: session.payment_intent,
        payment_date: new Date().toISOString(),
      };
      if (paymentIntentCurrency) updatePayload.currency = paymentIntentCurrency;

      const { error: updateError } = await supabase
        .from("orders")
        .update(updatePayload)
        .eq("id", orderId);

      if (updateError) {
        console.error(`[webhook] Failed to update order ${orderId}:`, updateError);
        // Return 200 so Stripe doesn't retry; we'll handle retry logic ourselves
        return res.json({ received: true });
      }

      console.info(`[webhook] Successfully processed payment for order ${orderId}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("[webhook] Unexpected error:", err);
    // Return 200 so Stripe doesn't retry; we logged the error for manual review
    res.json({ received: true });
  }
});

export default router;
