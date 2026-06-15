-- Enable users to delete their own account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void AS $$
BEGIN
  -- Delete the authenticated user from the auth.users table
  -- This will cascade and delete their profile and other related data
  -- if foreign key constraints are set up with ON DELETE CASCADE
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;