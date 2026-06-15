-- ============================================================
-- CLEANUP: drop all overlapping cross-user document/storage policies
-- that were added as patches across multiple migrations
-- ============================================================

-- Drop redundant cross-user document SELECT policies
DROP POLICY IF EXISTS "Providers can read documents of their clients" ON public.documents;
DROP POLICY IF EXISTS "Clients can read provider documents shared via threads" ON public.documents;

-- Drop all overlapping/conflicting storage SELECT policies
DROP POLICY IF EXISTS "Users can view encrypted documents shared with them." ON storage.objects;
DROP POLICY IF EXISTS "Providers can read documents in bucket" ON storage.objects;
DROP POLICY IF EXISTS "Clients can read provider documents in bucket" ON storage.objects;
DROP POLICY IF EXISTS "Clients can read provider documents via shared thread" ON storage.objects;
DROP POLICY IF EXISTS "Providers can read client documents via shared thread" ON storage.objects;

-- Drop the now-unnecessary RPC
DROP FUNCTION IF EXISTS get_shared_document(uuid);

-- ============================================================
-- REPLACE: one clean documents SELECT policy
-- Covers: owner, document_access, thread-based client<->provider
-- ============================================================
DROP POLICY IF EXISTS "Users can select documents they own or have access to" ON public.documents;

CREATE POLICY "Users can select documents they own or have access to" ON public.documents
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR id IN (
            SELECT document_id FROM public.document_access WHERE user_id = auth.uid()
        )
        OR EXISTS (
            -- Provider reading their client's document
            SELECT 1 FROM public.message_threads mt
            JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
            WHERE mt.client_id = public.documents.user_id
              AND pm.user_id = auth.uid()
        )
        OR EXISTS (
            -- Client reading their provider's document
            SELECT 1 FROM public.message_threads mt
            JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
            WHERE pm.user_id = public.documents.user_id
              AND mt.client_id = auth.uid()
        )
    );

-- ============================================================
-- REPLACE: one clean storage.objects SELECT policy
-- Uses file path pattern (no documents table join = no circular RLS)
-- ============================================================
DROP POLICY IF EXISTS "Users can select their own encrypted documents." ON storage.objects;

CREATE POLICY "Users can select their own encrypted documents." ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'documents'
        AND (
            (auth.uid())::text = (string_to_array(name, '/'))[1]
            OR EXISTS (
                -- Client reading provider file
                SELECT 1 FROM public.message_threads mt
                JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
                WHERE pm.user_id::text = (string_to_array(storage.objects.name, '/'))[1]
                  AND mt.client_id = auth.uid()
            )
            OR EXISTS (
                -- Provider reading client file
                SELECT 1 FROM public.message_threads mt
                JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
                WHERE mt.client_id::text = (string_to_array(storage.objects.name, '/'))[1]
                  AND pm.user_id = auth.uid()
            )
        )
    );
