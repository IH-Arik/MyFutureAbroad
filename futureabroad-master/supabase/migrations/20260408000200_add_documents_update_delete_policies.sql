-- Add UPDATE and DELETE policies for documents table
CREATE POLICY "Users can update their own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);
