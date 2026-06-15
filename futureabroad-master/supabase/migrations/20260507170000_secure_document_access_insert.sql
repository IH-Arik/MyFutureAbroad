-- ============================================================
-- DOCUMENT ACCESS: allow thread partners to insert document_access
-- for documents shared between them
-- ============================================================

DROP POLICY IF EXISTS "Users can insert document access for their own documents" ON public.document_access;

CREATE POLICY "Users can insert document access for shared documents" ON public.document_access
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Owner can always grant access
        EXISTS (
            SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()
        )
        OR
        -- Thread partner can grant access to the other party
        EXISTS (
            SELECT 1 FROM public.documents d
            -- Sender owns the document AND has a thread spanning to the recipient
            WHERE d.id = document_id
              AND d.user_id = auth.uid()
              AND EXISTS (
                  SELECT 1 FROM public.message_threads mt
                  JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
                  WHERE (
                      -- Sender is client, recipient is a provider member
                      (mt.client_id = auth.uid() AND pm.user_id = document_access.user_id)
                      OR
                      -- Sender is provider member, recipient is the client
                      (pm.user_id = auth.uid() AND mt.client_id = document_access.user_id)
                  )
              )
        )
    );
