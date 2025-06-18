/*
  # MindWell Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `professionals` - Professional-specific data
    - `sessions` - Therapy session bookings
    - `payments` - Payment records
    - `tokens` - Token transactions
    - `mood_entries` - Mood tracking data
    - `messages` - Secure messaging between users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles
*/

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

-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  license_number text,
  specialties text[] DEFAULT '{}',
  bio text,
  experience_years integer DEFAULT 0,
  languages text[] DEFAULT '{"English"}',
  session_types text[] DEFAULT '{"video", "audio", "chat"}',
  hourly_rate decimal(10,2) DEFAULT 120.00,
  token_rate integer DEFAULT 500,
  availability jsonb DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  professional_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type text CHECK (session_type IN ('video', 'audio', 'chat')) DEFAULT 'video',
  status text CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 50,
  price_usd decimal(10,2),
  price_tokens integer,
  payment_method text CHECK (payment_method IN ('stripe', 'tokens')) NOT NULL,
  payment_status text CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  stripe_payment_intent_id text,
  notes text,
  session_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  stripe_payment_intent_id text UNIQUE,
  amount_usd decimal(10,2) NOT NULL,
  currency text DEFAULT 'usd',
  status text CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')) DEFAULT 'pending',
  payment_method_id text,
  receipt_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type text CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'refund')) NOT NULL,
  amount integer NOT NULL,
  balance_after integer NOT NULL,
  reason text NOT NULL,
  category text CHECK (category IN ('session', 'mood', 'resource', 'streak', 'milestone', 'reward', 'purchase')) NOT NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 10) NOT NULL,
  mood_emoji text NOT NULL,
  notes text,
  factors text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date(created_at))
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  content text NOT NULL,
  message_type text CHECK (message_type IN ('text', 'image', 'file')) DEFAULT 'text',
  file_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
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

-- Professionals policies
CREATE POLICY "Anyone can read professional profiles"
  ON professionals FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Professionals can update own profile"
  ON professionals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Professionals can insert own profile"
  ON professionals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Sessions policies
CREATE POLICY "Users can read own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = professional_id);

CREATE POLICY "Patients can create sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = professional_id);

-- Payments policies
CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tokens policies
CREATE POLICY "Users can read own tokens"
  ON tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens"
  ON tokens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Mood entries policies
CREATE POLICY "Users can read own mood entries"
  ON mood_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON mood_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries"
  ON mood_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_active ON professionals(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_professional_id ON sessions(professional_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_date ON mood_entries(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);

-- Create functions for token balance calculation
CREATE OR REPLACE FUNCTION get_user_token_balance(user_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN COALESCE(
    (SELECT balance_after 
     FROM tokens 
     WHERE user_id = user_uuid 
     ORDER BY created_at DESC 
     LIMIT 1), 
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();