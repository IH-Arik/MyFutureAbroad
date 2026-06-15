import express from "express";
import { stripe, supabase } from "../config.js";
import { requireAuth } from "../requireAuth.js";

const router = express.Router();

// POST /api/providers/:providerId/stripe-onboarding
router.post("/:providerId/stripe-onboarding", requireAuth, async (req, res) => {
  try {
    const { providerId } = req.params;
    const userId = req.userId;

    const { data: membership, error: memberError } = await supabase
      .from("provider_members")
      .select("role")
      .eq("user_id", userId)
      .eq("provider_id", providerId)
      .single();


    if (!membership || membership.role !== "owner") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("id, company_name, contact_email")
      .eq("id", providerId)
      .single();


    if (providerError || !provider) {
      console.error("❌ Provider not found. Error:", providerError);
      return res.status(404).json({ error: "Provider not found" });
    }

    let stripeAccountId: string | null = null;
    try {
      const { data: providerWithStripe } = await supabase
        .from("providers")
        .select("stripe_connect_account_id")
        .eq("id", providerId)
        .single();
      stripeAccountId = providerWithStripe?.stripe_connect_account_id || null;
    } catch (err) {
      stripeAccountId = null;
    }

    if (!stripeAccountId) {
      
      const businessProfile: any = {
        name: provider.company_name,
      };
      
      if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith("http")) {
        businessProfile.url = process.env.FRONTEND_URL;
      }
      
      const account = await stripe.accounts.create({
        type: "standard",
        country: "US", // TODO: Make this configurable
        email: provider.contact_email,
        business_profile: businessProfile,
        metadata: {
          provider_id: providerId,
        },
      });

      stripeAccountId = account.id;

      const { error: saveError } = await supabase
        .from("providers")
        .update({ stripe_connect_account_id: stripeAccountId })
        .eq("id", providerId);

      if (saveError && saveError.code !== "42703") {
        console.error("Failed to save Stripe account ID:", saveError);
        return res.status(500).json({ error: "Failed to save account" });
      }

    }

    
    if (!stripeAccountId) {
      return res.status(500).json({ error: "Failed to create Stripe account" });
    }
    
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      type: "account_onboarding",
      refresh_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/onboarding?providerId=${providerId}&status=error`,
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/onboarding?providerId=${providerId}&status=complete`,
    });

    res.json({ onboarding_url: accountLink.url });
  } catch (err) {
    console.error("Stripe onboarding error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/providers/:providerId/stripe-status
router.get("/:providerId/stripe-status", requireAuth, async (req, res) => {
  try {
    const { providerId } = req.params;
    const userId = req.userId;

    const { data: membership } = await supabase
      .from("provider_members")
      .select("role")
      .eq("user_id", userId)
      .eq("provider_id", providerId)
      .single();

    if (!membership) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    let stripeAccountId: string | null = null;
    try {
      const { data: provider } = await supabase
        .from("providers")
        .select("stripe_connect_account_id")
        .eq("id", providerId)
        .single();
      stripeAccountId = provider?.stripe_connect_account_id || null;
    } catch (err) {
    }

    if (!stripeAccountId) {
      return res.json({ 
        status: "not_connected",
        charges_enabled: false,
        payouts_enabled: false,
      });
    }

    const account = await stripe.accounts.retrieve(stripeAccountId);

    res.json({
      status: "connected",
      stripe_account_id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements,
      business_profile: account.business_profile,
    });
  } catch (err) {
    console.error("Stripe status error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
