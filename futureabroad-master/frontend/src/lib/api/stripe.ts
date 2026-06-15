import { getAuthToken } from "@/lib/auth";

const API_BASE = "/api";

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");
  return { "x-user-token": token };
}

export async function initiateStripePayment(orderId: string): Promise<void> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/payment/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create checkout session");
  }

  const { sessionUrl } = await response.json();
  window.location.href = sessionUrl;
}

export async function getStripeOnboardingUrl(providerId: string): Promise<string> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/providers/${providerId}/stripe-onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get onboarding URL");
  }

  const data = await response.json();
  return data.onboarding_url;
}

export interface StripeAccountStatus {
  status: "not_connected" | "connected";
  stripe_account_id?: string;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  requirements?: any;
  business_profile?: any;
}

export async function getStripeAccountStatus(providerId: string): Promise<StripeAccountStatus> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/providers/${providerId}/stripe-status`, { headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get account status");
  }

  return response.json();
}

export default {} as any;
