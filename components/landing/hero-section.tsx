'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import { useAuth } from '@/providers/auth-provider';
import { UserCheck, Stethoscope, Sparkles, Heart, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const { t } = useLanguage();
  const { user, profile, updateUserType } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJoinAs = async (userType: 'patient' | 'professional') => {
    // If user is not signed in, redirect to sign up with type parameter
    if (!user) {
      router.push(`/sign-up?type=${userType}`);
      return;
    }

    // If user is signed in but has no profile or user type, update it
    if (!profile?.user_type) {
      try {
        await updateUserType(userType);
        toast.success(`Welcome! You've joined as a ${userType}`);
        
        // Redirect to appropriate dashboard
        const dashboardPath = userType === 'patient' ? '/dashboard/patient' : '/dashboard/professional';
        router.push(dashboardPath);
      } catch (error) {
        toast.error('Error updating profile');
      }
      return;
    }

    // If user already has a type, redirect to dashboard
    const dashboardPath = profile.user_type === 'patient' ? '/dashboard/patient' : '/dashboard/professional';
    router.push(dashboardPath);
  };

  const handleStartJourney = () => {
    // If user is not signed in, redirect to sign up page
    if (!user) {
      router.push('/sign-up');
      return;
    }

    // If user is signed in but has no profile or user type, redirect to sign up to choose type
    if (!profile?.user_type) {
      router.push('/sign-up');
      return;
    }

    // If user already has a type, redirect to dashboard
    const dashboardPath = profile.user_type === 'patient' ? '/dashboard/patient' : '/dashboard/professional';
    router.push(dashboardPath);
  };

  if (!mounted) {
    return (
      <section className="pt-32 pb-20 px-4 gradient-bg relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto text-center">
          <div className="skeleton h-16 w-3/4 mx-auto mb-8 rounded-lg"></div>
          <div className="skeleton h-6 w-1/2 mx-auto mb-12 rounded"></div>
          <div className="flex gap-4 justify-center">
            <div className="skeleton h-12 w-32 rounded-lg"></div>
            <div className="skeleton h-12 w-32 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-20 px-4 gradient-bg relative overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary floating elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float morphing-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-healing/20 rounded-full blur-3xl animate-float-delayed morphing-blob" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warm/10 rounded-full blur-3xl animate-float-slow morphing-blob" />
        
        {/* Secondary floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-bounce-gentle" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-healing/15 rounded-full blur-xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-warm/20 rounded-full blur-lg animate-pulse-slow" />
        
        {/* Sparkle effects */}
        <div className="absolute top-1/4 left-1/3 animate-bounce-gentle">
          <Sparkles className="w-6 h-6 text-primary/30" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-float">
          <Star className="w-4 h-4 text-healing/40" />
        </div>
        <div className="absolute top-2/3 left-1/4 animate-pulse-slow">
          <Zap className="w-5 h-5 text-warm/35" />
        </div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Main Heading with Enhanced Animation */}
          <div className="animate-slide-up">
            <h1 className="text-responsive-xl font-bold leading-tight mb-6">
              <span className="text-gradient animate-gradient">
                {t('hero.title')}
              </span>
            </h1>
            
            {/* Subtitle with Fade Animation */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Enhanced CTA Section */}
          <div className="pt-8 space-y-8 animate-scale-in">
            {/* Main CTA Button - Now functional */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg font-semibold btn-primary button-glow animate-glow"
                onClick={handleStartJourney}
              >
                <Heart className="mr-3 w-6 h-6" />
                {t('hero.cta.primary')}
                <Sparkles className="ml-3 w-6 h-6" />
              </Button>
            </div>

            {/* Smart Join Options with Enhanced Styling */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="group px-10 py-6 text-base font-medium border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 card-hover button-glow bg-white/80 backdrop-blur-sm"
                onClick={() => handleJoinAs('patient')}
              >
                <UserCheck className="mr-3 w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Join as Patient</span>
                <div className="ml-3 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group px-10 py-6 text-base font-medium border-2 border-healing/30 hover:bg-healing/10 hover:border-healing transition-all duration-300 card-hover button-glow bg-white/80 backdrop-blur-sm"
                onClick={() => handleJoinAs('professional')}
              >
                <Stethoscope className="mr-3 w-6 h-6 text-healing group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Join as Professional</span>
                <div className="ml-3 w-2 h-2 bg-healing rounded-full animate-pulse"></div>
              </Button>
            </div>

            {/* Sign in link with enhanced styling */}
            {!user && (
              <div className="pt-6 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    href="/sign-in" 
                    className="text-primary hover:text-primary/80 font-medium hover:underline transition-all duration-200 inline-flex items-center gap-1"
                  >
                    Sign in here
                    <Sparkles className="w-3 h-3" />
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="pt-20 animate-slide-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '10k+', label: 'Active Users', icon: UserCheck, color: 'text-primary' },
                { number: '500+', label: 'Licensed Professionals', icon: Stethoscope, color: 'text-healing' },
                { number: '50k+', label: 'Sessions Completed', icon: Heart, color: 'text-warm' },
                { number: '4.9★', label: 'User Rating', icon: Star, color: 'text-primary' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="space-y-3 p-6 rounded-2xl glass-effect card-hover group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-healing/10 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gradient animate-gradient">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Visual Elements */}
          <div className="pt-16 flex justify-center space-x-8 opacity-60">
            <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent rounded-full animate-pulse"></div>
            <div className="w-1 h-20 bg-gradient-to-b from-healing to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-1 h-12 bg-gradient-to-b from-warm to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}