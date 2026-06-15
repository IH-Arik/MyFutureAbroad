import { getAuthToken } from "@/lib/auth";

const API_BASE = "/api";

export interface CreateOrderRequest {
  clientId: string;
  serviceId: string;
  providerId: string;
  threadId?: string;
  amount: number; // in cents
  notes?: string;
  currency?: string;
}

export interface Order {
  id: string;
  client_id: string;
  service_id: string;
  provider_id: string;
  status: "pending" | "active" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  amount: number;
  notes: string | null;
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  commission_amount: number | null;
  commission_percentage: number;
  payment_date: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
  services?: {
    id: string;
    title: string;
    price_usd: number;
    price_type: string;
  };
  providers?: {
    id: string;
    company_name: string;
    preferred_currency?: string;
  };
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");
  return { "x-user-token": token };
}

export async function createPaymentRequest(request: CreateOrderRequest): Promise<Order> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    console.error("Response error:", await response.json());
    throw new Error(`Failed to create payment request: ${response.statusText}`);
  }

  return response.json();
}

export async function acceptOrder(orderId: string): Promise<Order> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/orders/${orderId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to accept order");
  }

  return response.json();
}

export async function rejectOrder(orderId: string): Promise<Order> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/orders/${orderId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to reject order");
  }

  return response.json();
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to cancel order");
  }

  return response.json();
}

export async function getOrderInvoice(orderId: string): Promise<{
  invoiceUrl?: string;
  receiptUrl?: string;
  chargeId: string;
  amount: number;
  currency: string;
  created: number;
}> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/orders/${orderId}/invoice`, { headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to retrieve invoice");
  }

  return response.json();
}

export default {} as any;
