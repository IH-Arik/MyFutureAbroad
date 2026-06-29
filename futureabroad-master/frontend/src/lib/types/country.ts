export interface Country {
    id: number;
    name: string;
    iso_code: string;
    flag_url: string;
    highlight_img_url?: string;
    description?: string;
    longdescription?: string;
    citizenship_requirements?: Record<string, { icon: string; desc: string }>;
    tax_advice?: string;
    extra_info?: string;
    local_tips?: string;
    pros_for_expats?: string[];
    cons_for_expats?: string[];
}

export default {} as any;
