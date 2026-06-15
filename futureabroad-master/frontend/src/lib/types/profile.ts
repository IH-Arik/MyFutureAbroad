export interface Profile {
    id: string;
    role: 'client' | 'provider';
    provider_id: string | null; // legacy single-link, kept for backwards compat
    full_name: string | null;
    avatar_url: string | null;
    created_at?: string;
}

export default {} as any;
