-- Allow clients to read storage objects owned by providers they have a thread with
-- This bypasses the need for document_access records and works even when
-- the documents table RLS blocks cross-user queries.
CREATE POLICY "Clients can read provider documents via shared thread"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE pm.user_id::text = (string_to_array(name, '/'))[1]
          AND mt.client_id = auth.uid()
    )
);

-- Allow providers to read storage objects owned by clients they have a thread with
CREATE POLICY "Providers can read client documents via shared thread"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE mt.client_id::text = (string_to_array(name, '/'))[1]
          AND pm.user_id = auth.uid()
    )
);
