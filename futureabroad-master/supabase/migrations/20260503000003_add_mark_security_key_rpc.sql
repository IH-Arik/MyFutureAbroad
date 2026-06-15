-- RPC to mark a security key as used
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS safely.
CREATE OR REPLACE FUNCTION mark_security_key_used(p_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows_affected INTEGER;
BEGIN
  UPDATE provider_security_keys
  SET used_at = now(),
      used_by = auth.uid()
  WHERE key = p_key
    AND active = TRUE
    AND used_at IS NULL;

  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  
  RETURN v_rows_affected > 0;
END;
$$;

-- Revoke public execute, grant only to authenticated users
REVOKE ALL ON FUNCTION mark_security_key_used(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION mark_security_key_used(TEXT) TO authenticated;
