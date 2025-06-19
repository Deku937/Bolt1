'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

interface SimpleProfile {
  user_type: 'patient' | 'professional' | null;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  profile: SimpleProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserType: (userType: 'patient' | 'professional') => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SimpleProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create supabase client instance
  const supabase = createClient();

  // Simple localStorage-based profile management
  const getStorageKey = (userId: string) => `mindwell_profile_${userId}`;

  const loadProfile = (userId: string): SimpleProfile | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(getStorageKey(userId));
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const saveProfile = (userId: string, profile: SimpleProfile) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userProfile = loadProfile(session.user.id);
        setProfile(userProfile);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userProfile = loadProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create a simple profile in localStorage
        const newProfile: SimpleProfile = {
          user_type: null, // Will be set when user chooses
          first_name: firstName || email.split('@')[0],
          last_name: lastName || '',
        };
        
        saveProfile(data.user.id, newProfile);
        setProfile(newProfile);
        
        toast.success('Account created successfully! Welcome to MindWell.');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific errors
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please check your email and click the verification link.');
      } else {
        toast.error('Account created! You can now sign in.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the verification link before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please try again.');
        } else {
          toast.error(error.message || 'Error signing in');
        }
        throw error;
      }
      
      if (data.user) {
        // Load or create profile
        let userProfile = loadProfile(data.user.id);
        
        if (!userProfile) {
          // Create new profile for existing user
          userProfile = {
            user_type: null,
            first_name: data.user.user_metadata?.first_name || data.user.email?.split('@')[0] || 'User',
            last_name: data.user.user_metadata?.last_name || '',
          };
          saveProfile(data.user.id, userProfile);
        }
        
        setProfile(userProfile);
        toast.success('Signed in successfully!');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  const updateUserType = async (userType: 'patient' | 'professional') => {
    if (!user) return;

    try {
      const currentProfile = profile || {
        user_type: null,
        first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'User',
        last_name: user.user_metadata?.last_name || '',
      };

      const updatedProfile: SimpleProfile = {
        ...currentProfile,
        user_type: userType,
      };

      saveProfile(user.id, updatedProfile);
      setProfile(updatedProfile);
      
      toast.success(`Welcome! You've joined as a ${userType}`);
    } catch (error: any) {
      console.error('Error updating user type:', error);
      toast.error('Error updating profile. Please try again.');
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = loadProfile(user.id);
      setProfile(userProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session,
      loading, 
      signUp,
      signIn, 
      signOut, 
      updateUserType, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}