-- Create document categories
CREATE TABLE public.document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Insert default categories
INSERT INTO public.document_categories (name, description) VALUES 
('Passport', 'Official passport documents'), 
('Driver''s License', 'Driving permits and licenses'), 
('Insurance', 'Health, travel, and vehicle insurance papers'), 
('Visas', 'Visa grants and applications'),
('Other', 'Miscellaneous documents');

-- Table for user cryptographic keys
CREATE TABLE public.user_keys (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    public_key TEXT NOT NULL,
    encrypted_private_key TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table for uploaded documents
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.document_categories(id),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    content_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Documents Access Control (Encrypted AES keys for each user who can access)
CREATE TABLE public.document_access (
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    encrypted_aes_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (document_id, user_id)
);

-- Enable RLS
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Categories are readable by everyone." ON public.document_categories
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own keys." ON public.user_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view everyone's public key (to share docs), but only their own private key." ON public.user_keys
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own keys." ON public.user_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select documents they own or have access to" ON public.documents
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.document_access WHERE document_id = public.documents.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert document access for their own documents" ON public.document_access
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view document access for documents they can access" ON public.document_access
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()
        )
    );
