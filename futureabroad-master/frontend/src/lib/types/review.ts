export interface ServiceReview {
    id: string;
    service_id: string;
    provider_id: string;
    client_id: string;
    rating: number;
    body: string | null;
    created_at: string;
    updated_at?: string;
    profile?: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export default {} as any;
