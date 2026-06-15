-- RPC to validate a provider security key without exposing the full table via RLS.
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS safely.
-- Returns: 'valid' | 'invalid' | 'already_used'
CREATE OR REPLACE FUNCTION validate_provider_security_key(p_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_used_at TIMESTAMP;
  v_found   BOOLEAN := FALSE;
BEGIN
  SELECT used_at, TRUE
    INTO v_used_at, v_found
    FROM provider_security_keys
   WHERE key = p_key
     AND active = TRUE
   LIMIT 1;

  IF NOT v_found THEN
    RETURN 'invalid';
  END IF;

  IF v_used_at IS NOT NULL THEN
    RETURN 'already_used';
  END IF;

  RETURN 'valid';
END;
$$;

-- Revoke public execute, grant only to authenticated users
REVOKE ALL ON FUNCTION validate_provider_security_key(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION validate_provider_security_key(TEXT) TO authenticated;
