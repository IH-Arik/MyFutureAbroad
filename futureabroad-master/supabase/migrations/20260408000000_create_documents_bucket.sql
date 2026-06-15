-- Add Storage bucket for private encrypted documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the documents bucket
CREATE POLICY "Users can upload their own encrypted documents."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND (auth.uid())::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can select their own encrypted documents."
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND (auth.uid())::text = (string_to_array(name, '/'))[1]);

-- Assume users might eventually read objects from other paths shared with them (handled via UI fetch if signed urls are needed or read policies are opened up based on document_access).
-- For now, letting users fetch specifically granted documents using the same subquery logic from the `documents` table:
CREATE POLICY "Users can view encrypted documents shared with them."
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.document_access da ON d.id = da.document_id
    WHERE d.file_path = storage.objects.name AND da.user_id = auth.uid()
  )
);
