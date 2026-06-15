-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can select documents they own or have access to" ON public.documents;
DROP POLICY IF EXISTS "Users can view document access for documents they can access" ON public.document_access;

-- Recreate simpler policies without circular references
-- For documents: Users can see documents they own OR documents where they have an access record
CREATE POLICY "Users can select documents they own or have access to" ON public.documents
    FOR SELECT USING (
        auth.uid() = user_id OR
        id IN (SELECT document_id FROM public.document_access WHERE user_id = auth.uid())
    );

-- For document_access: Users can see their own access records
CREATE POLICY "Users can view their own document access records" ON public.document_access
    FOR SELECT USING (user_id = auth.uid());
