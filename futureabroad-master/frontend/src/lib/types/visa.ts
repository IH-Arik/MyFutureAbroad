export interface Visa {
	id: number;
	name: string;
	visa_type: string;
	description: string;
	application_fee_usd: number;
	processing_time_days: number;
	renewable?: boolean;
	country_id: number;
	benefits?: string[];
	min_age?: number;
	max_age?: number;
	min_income?: number;
	min_income_currency?: string;
	min_savings?: number;
	min_savings_currency?: string;
	required_skills?: string[];
	eligible_nationalities?: string[];
	excluded_nationalities?: string[];
	requires_health_insurance?: boolean;
	requires_clean_criminal_record?: boolean;
	validity_months?: number;
	has_path_to_residency?: boolean;
	path_to_residency_description?: string;
	application_fee_currency?: string;
	base_currency?: string;
	application_fee_amount?: number;
	required_documents?: string[];
	official_link?: string;
	image_url?: string;
	additional_info?: any;
}

export default {} as any;
