-- Allow clients to read documents owned by providers they have a thread with
CREATE POLICY "Clients can read provider documents shared via threads"
ON public.documents FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE pm.user_id = public.documents.user_id
          AND mt.client_id = auth.uid()
    )
);

-- Allow clients to fetch the storage object for those provider-owned documents
CREATE POLICY "Clients can read provider documents in bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.documents d
        JOIN public.provider_members pm ON pm.user_id = d.user_id
        JOIN public.message_threads mt ON mt.provider_id = pm.provider_id
        WHERE d.file_path = storage.objects.name
          AND mt.client_id = auth.uid()
    )
);
