export interface ServiceType {
    id: string; // e.g. 'visa_application'
    name: string;
    icon: string;
    tagline: string;
    description: string;
}

export interface Provider {
    id: string; // uuid
    company_name: string;
    description: string;
    provider_type: string;
    status?: string;
    rating: number;
    review_count: number;
    verified: boolean;
    response_time_hours: number;
    contact_email: string;
    website: string;
    logo_url?: string;
    countries_served?: number[];
    languages?: string[];
    preferred_currency?: string;
}

export interface Service {
    id: string; // uuid
    provider_id: string;
    service_type: string;
    title: string;
    description: string;
    short_description?: string | null;
    price_usd?: number | null;
    currency?: string | null;
    price_type: 'fixed' | 'starting_at' | 'hourly';
    delivery_days: number;
    includes: string[];
    requirements: string[];
    image_url?: string;
    active: boolean;
    applicable_countries?: number[];
    applicable_visas?: number[];
    languages?: string[];
    provider?: Provider;
    type_details?: ServiceType;
}

export interface ProviderMember {
    id: string;
    user_id: string;
    provider_id: string;
    role: 'owner' | 'admin' | 'member';
    joined_at?: string;
    provider?: Provider;
}

export default {} as any;
