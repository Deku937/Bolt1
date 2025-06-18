import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  user_type: 'patient' | 'professional' | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string;
  user_id: string;
  license_number: string | null;
  specialties: string[];
  bio: string | null;
  experience_years: number;
  languages: string[];
  session_types: string[];
  hourly_rate: number;
  token_rate: number;
  availability: any;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  patient_id: string;
  professional_id: string;
  session_type: 'video' | 'audio' | 'chat';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_at: string;
  duration_minutes: number;
  price_usd: number | null;
  price_tokens: number | null;
  payment_method: 'stripe' | 'tokens';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_payment_intent_id: string | null;
  notes: string | null;
  session_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_usd: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
  payment_method_id: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  transaction_type: 'earned' | 'spent' | 'bonus' | 'refund';
  amount: number;
  balance_after: number;
  reason: string;
  category: 'session' | 'mood' | 'resource' | 'streak' | 'milestone' | 'reward' | 'purchase';
  session_id: string | null;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  mood_emoji: string;
  notes: string | null;
  factors: string[];
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  session_id: string | null;
  content: string;
  message_type: 'text' | 'image' | 'file';
  file_url: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at'>>;
      };
      professionals: {
        Row: Professional;
        Insert: Omit<Professional, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Professional, 'id' | 'user_id' | 'created_at'>>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Session, 'id' | 'created_at'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Payment, 'id' | 'created_at'>>;
      };
      tokens: {
        Row: TokenTransaction;
        Insert: Omit<TokenTransaction, 'id' | 'created_at'>;
        Update: Partial<Omit<TokenTransaction, 'id' | 'created_at'>>;
      };
      mood_entries: {
        Row: MoodEntry;
        Insert: Omit<MoodEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<MoodEntry, 'id' | 'created_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
      };
    };
    Functions: {
      get_user_token_balance: {
        Args: { user_uuid: string };
        Returns: number;
      };
    };
  };
}