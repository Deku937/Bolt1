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
  }, [user, profile, router]);

  if (user && profile?.user_type) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg">
      <div className="w-full max-w-md">
        <AuthForm mode="signin" />
      </div>
    </div>
  );
}