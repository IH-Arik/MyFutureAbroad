export interface Budget {
    id: string; // uuid
    user_id: string; // auth.users.id
    name: string;
    total_amount?: number | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface BudgetItem {
    id: string; // uuid
    budget_id: string;
    name: string;
    cost: number;
    category: string;
    status: boolean; // completed or not
    currency?: string; // currency code (USD, EUR, etc.)
    created_at?: string;
    updated_at?: string;
}

export default {} as any;
