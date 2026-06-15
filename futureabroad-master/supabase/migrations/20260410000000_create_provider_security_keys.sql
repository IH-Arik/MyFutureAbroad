-- Create security keys table for business signup verification
CREATE TABLE IF NOT EXISTS provider_security_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now(),
  used_at timestamp DEFAULT NULL,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT,
  active BOOLEAN DEFAULT true
);

-- Add RLS policies
ALTER TABLE provider_security_keys ENABLE ROW LEVEL SECURITY;

-- Admins can view/create/update/delete keys they created
CREATE POLICY "Admins can manage own keys" ON provider_security_keys
  FOR ALL USING (auth.jwt() ->> 'role' = 'authenticated' AND created_by = auth.uid());

-- Authenticated users can read active, unused keys for validation during signup
CREATE POLICY "Users can validate active keys" ON provider_security_keys
  FOR SELECT USING (auth.jwt() ->> 'role' = 'authenticated' AND active = true AND used_at IS NULL);

-- Add index for fast key lookup
CREATE INDEX IF NOT EXISTS idx_provider_security_keys_key ON provider_security_keys(key);
CREATE INDEX IF NOT EXISTS idx_provider_security_keys_used_at ON provider_security_keys(used_at);
