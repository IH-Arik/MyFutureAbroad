export interface Country {
  id: number;
  name: string;
  iso_code?: string;
  continent: string;
  flag_url?: string;
  highlight_img_url?: string;
  description?: string;
  longdescription?: string;
  tax_advice?: string;
  extra_info?: string;
  local_tips?: string;
  created_at?: string;
}

export interface Visa {
  id: number;
  name: string;
  visa_type?: string;
  country_id: number;
  description?: string;
  benefits?: string[];
  min_age?: number | null;
  max_age?: number | null;
  min_income?: number | null;
  min_income_currency?: string;
  min_savings?: number | null;
  min_savings_currency?: string;
  required_skills?: string[];
  eligible_nationalities?: string[];
  excluded_nationalities?: string[];
  requires_health_insurance?: boolean;
  requires_clean_criminal_record?: boolean;
  processing_time_days?: number | null;
  validity_months?: number | null;
  renewable?: boolean;
  has_path_to_residency?: boolean;
  path_to_residency_description?: string;
  application_fee_usd?: number | null;
  application_fee_currency?: string;
  base_currency?: string;
  application_fee_amount?: number | null;
  required_documents?: string[];
  official_link?: string;
  image_url?: string;
  created_at?: string;
}

export interface VisaWithCountry extends Visa {
  countries?: { name: string } | null;
}
