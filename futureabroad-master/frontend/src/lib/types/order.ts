import type { Service } from "./service";
import type { Provider } from "./service";

export interface Order {
    id: string;
    client_id: string;
    service_id: string;
    provider_id: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
    amount?: number;
    currency?: string; // ISO 4217 currency code for this order (e.g., USD, EUR)
    payment_date?: string;
    stripe_payment_intent_id?: string;
    stripe_transfer_id?: string;
    commission_amount?: number;
    commission_percentage?: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    // Joined data
    service?: Service;
    provider?: Provider;
}

export interface MessageThread {
    id: string;
    order_id: string;
    client_id: string;
    provider_id: string;
    created_at?: string;
    // Joined data
    order?: Order;
    provider?: Provider;
    client?: { full_name?: string | null };
    last_message?: Message;
    unread_count?: number;
}

export interface Message {
    id: string;
    thread_id: string;
    sender_id: string;
    sender_type: 'client' | 'provider';
    body: string;
    created_at?: string;
}

export default {} as any;
