import dotenv from "dotenv";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const supaUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseInfo = {
  url: supaUrl,
  keyLength: serviceRoleKey ? serviceRoleKey.length : 0,
  keyPrefix: serviceRoleKey ? serviceRoleKey.substring(0, 10) : "none",
};

// Admin client: bypasses RLS. Use only for Stripe ops, auth.admin calls, webhooks.
export const supabase = createClient(supaUrl, serviceRoleKey);
export const supabaseAdmin = supabase;

export const COMMISSION_PERCENTAGE = 10;
