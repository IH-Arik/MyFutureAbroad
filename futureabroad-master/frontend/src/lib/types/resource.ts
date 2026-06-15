export interface Resource {
    id: number;
    title: string;
    type: string;
    excerpt: string;
    content: string;
    author: string;
    cover_image: string;
    tags: string[];
    reading_time_minutes: number;
    published: boolean;
    featured: boolean;
    created_at?: string;
}

export default {} as any;
