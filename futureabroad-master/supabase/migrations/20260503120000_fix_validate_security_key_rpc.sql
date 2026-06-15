-- Fix validate_provider_security_key RPC to correctly treat missing rows as invalid
-- Uses FOUND after SELECT ... INTO to detect absence of rows
CREATE OR REPLACE FUNCTION validate_provider_security_key(p_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_used_at TIMESTAMP;
BEGIN
  SELECT used_at
    INTO v_used_at
    FROM provider_security_keys
   WHERE key = p_key
     AND active = TRUE
   LIMIT 1;

  -- If no row was found, FOUND will be false
  IF NOT FOUND THEN
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
