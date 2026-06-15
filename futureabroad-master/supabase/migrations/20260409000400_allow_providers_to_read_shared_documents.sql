-- Allow providers to read documents of clients they have threads with
CREATE POLICY "Providers can read documents of their clients"
ON public.documents FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE mt.client_id = public.documents.user_id
          AND pm.user_id = auth.uid()
    )
);

-- Allow providers to fetch the url of the document in the documents bucket
CREATE POLICY "Providers can read documents in bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.documents d
        JOIN public.message_threads mt ON mt.client_id = d.user_id
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE d.file_path = storage.objects.name
          AND pm.user_id = auth.uid()
    )
);
