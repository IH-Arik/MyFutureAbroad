-- RPC to safely resolve a shared document's file path for the viewer.
-- This runs with SECURITY DEFINER (bypasses RLS) and returns only the
-- minimal data needed to generate a signed URL.
-- It verifies the caller has a thread with the document owner before returning data.
CREATE OR REPLACE FUNCTION get_shared_document(doc_id uuid)
RETURNS TABLE (
    id uuid,
    name text,
    file_path text,
    content_type text
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.name, d.file_path, d.content_type
    FROM public.documents d
    WHERE d.id = doc_id
      AND (
          -- Caller owns the document
          d.user_id = auth.uid()
          OR
          -- Caller is a client of a thread with the document owner
          EXISTS (
              SELECT 1 FROM public.message_threads mt
              JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
              WHERE pm.user_id = d.user_id
                AND mt.client_id = auth.uid()
          )
          OR
          -- Caller is a provider member with a thread to the document owner (client)
          EXISTS (
              SELECT 1 FROM public.message_threads mt
              JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
              WHERE mt.client_id = d.user_id
                AND pm.user_id = auth.uid()
          )
          OR
          -- Caller has a direct document_access record
          EXISTS (
              SELECT 1 FROM public.document_access da
              WHERE da.document_id = d.id
                AND da.user_id = auth.uid()
          )
      );
END;
$$ LANGUAGE plpgsql;
