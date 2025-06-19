# Fix Supabase Database Setup

The error occurs because the `profiles` table doesn't exist in your Supabase database yet. You need to manually run the migration.

## Steps to Fix:

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project: `qkykuwywlpkwmqbyjjpj`

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the entire contents of `supabase/migrations/20250617214606_dry_dream.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the migration

4. **Verify Tables Were Created**
   - Go to "Table Editor" in the left sidebar
   - You should see all the tables: `profiles`, `professionals`, `sessions`, `payments`, `tokens`, `mood_entries`, `messages`

5. **Test the Application**
   - Return to your app and try signing up again
   - The profile creation should now work

## Alternative: Quick Fix SQL

If you want to run just the essential parts first, here's the minimal SQL to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name text,
  last_name text,
  user_type text CHECK (user_type IN ('patient', 'professional')),
  avatar_url text,
  phone text,
  date_of_birth date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
```

## Email Confirmation Issue

If you're getting "Email not confirmed" errors, you have two options:

### Option 1: Disable Email Confirmation (Recommended for Development)
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Settings
3. Under "User Signups", toggle OFF "Enable email confirmations"
4. Save the changes

### Option 2: Confirm Emails Manually
- Users must check their email and click the verification link after signing up
- Only then can they sign in to the application

After running this migration and handling email confirmation, your sign-up and sign-in should work correctly.
```