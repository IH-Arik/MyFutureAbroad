export interface Checklist {
    id: string;
    user_id: string;
    name: string;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ChecklistItem {
    id: string;
    checklist_id: string;
    name: string;
    category: string;
    status: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface ChecklistCategory {
    id: string;
    user_id: string;
    name: string;
    created_at?: string;
}

export interface ChecklistTag {
    id: string;
    user_id: string;
    name: string;
    created_at?: string;
}

export interface ChecklistItemTag {
    checklist_item_id: string;
    tag_id: string;
}

export default {} as any;
