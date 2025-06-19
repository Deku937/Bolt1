'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { AuthForm } from '@/components/auth/auth-form';

export default function SignInPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already signed in and has a profile, redirect to dashboard
    if (user && profile?.user_type) {
      const dashboardPath = profile.user_type === 'patient' ? '/dashboard/patient' : '/dashboard/professional';
      router.push(dashboardPath);
    }
    // If user is signed in but no user type, redirect to home to choose
    else if (user && !profile?.user_type) {
      router.push('/');
    }
  }, [user, profile, router]);

  // Show loading or redirect
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 gradient-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg">
      <div className="w-full max-w-md">
        <AuthForm mode="signin" />
      </div>
    </div>
  );
}