'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import { useAuth } from '@/providers/auth-provider';
import { UserCheck, Stethoscope, Sparkles, Heart, Star, Zap, ArrowRight, Lock, Shield } from 'lucide-react';
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
    // If user is not signed in, redirect to sign up
    if (!user) {
      router.push('/sign-up');
      return;
    }

    // Check if user type is already locked
    if (profile?.user_type_locked && profile?.user_type) {
      toast.error(`Your account is already set as a ${profile.user_type}. To change your role, please create a new account.`);
      return;
    }

    // If user is signed in, update their user type (this will lock it permanently)
    try {
      await updateUserType(userType);
      
      // Redirect to appropriate dashboard
      const dashboardPath = userType === 'patient' ? '/dashboard/patient' : '/dashboard/professional';
      router.push(dashboardPath);
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleStartJourney = () => {
    // If user is not signed in, redirect to sign up page
    if (!user) {
      router.push('/sign-up');
      return;
    }

    // If user is signed in but has no user type, show the choice buttons
    if (!profile?.user_type) {
      // Scroll to the choice buttons
      const choiceSection = document.getElementById('user-type-choice');
      if (choiceSection) {
        choiceSection.scrollIntoView({ behavior: 'smooth' });
      }
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

  // Show different content based on auth state
  const showUserTypeChoice = user && !profile?.user_type;
  const isUserTypeLocked = profile?.user_type_locked && profile?.user_type;

  return (
    <section className="pt-32 pb-20 px-4 gradient-bg relative overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float morphing-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-healing/20 rounded-full blur-3xl animate-float-delayed morphing-blob" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warm/10 rounded-full blur-3xl animate-float-slow morphing-blob" />
        
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-bounce-gentle" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-healing/15 rounded-full blur-xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-warm/20 rounded-full blur-lg animate-pulse-slow" />
        
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
          {/* Main Heading */}
          <div className="animate-slide-up">
            <h1 className="text-responsive-xl font-bold leading-tight mb-6">
              <span className="text-gradient animate-gradient">
                {showUserTypeChoice ? 'Choose Your Path' : t('hero.title')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
              {showUserTypeChoice 
                ? 'Welcome! Please choose how you\'d like to use MindWell. This choice will be permanent for this account.'
                : t('hero.subtitle')
              }
            </p>
          </div>

          {/* Show locked status if user type is already set */}
          {isUserTypeLocked && (
            <div className="animate-scale-in">
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-healing/10 border border-primary/20">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-healing rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Account Type Locked</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      You're registered as a {profile?.user_type}
                    </p>
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your account type is permanently set and cannot be changed.
                  </p>
                  <Button 
                    onClick={handleStartJourney}
                    className="w-full btn-primary"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          {!isUserTypeLocked && (
            <div className="pt-8 space-y-8 animate-scale-in" id="user-type-choice">
              {!showUserTypeChoice ? (
                // Default CTA for non-authenticated users
                <>
                  <div className="flex justify-center">
                    <Button 
                      size="lg" 
                      className="px-12 py-6 text-lg font-semibold btn-primary button-glow animate-glow"
                      onClick={handleStartJourney}
                    >
                      <Heart className="mr-3 w-6 h-6" />
                      {user && profile?.user_type ? 'Go to Dashboard' : t('hero.cta.primary')}
                      <Sparkles className="ml-3 w-6 h-6" />
                    </Button>
                  </div>

                  {/* Join Options for non-authenticated users */}
                  {!user && (
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
                  )}
                </>
              ) : (
                // User type choice for authenticated users without profile
                <div className="space-y-8">
                  {/* Warning about permanent choice */}
                  <div className="max-w-2xl mx-auto p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200">Important: This choice is permanent</p>
                        <p className="text-amber-700 dark:text-amber-300">
                          Once you select your account type, it cannot be changed. You would need to create a new account to switch roles.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
                    {/* Patient Option */}
                    <div 
                      className="group p-8 rounded-2xl border-2 border-primary/30 hover:border-primary bg-white/80 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 cursor-pointer card-hover flex-1 max-w-md"
                      onClick={() => handleJoinAs('patient')}
                    >
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                          <UserCheck className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-primary">I'm seeking support</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect with licensed professionals, track your mood, and access personalized mental health resources.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-primary font-medium">
                          <span>Join as Patient</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Lock className="w-3 h-3" />
                          <span>Permanent choice</span>
                        </div>
                      </div>
                    </div>

                    {/* Professional Option */}
                    <div 
                      className="group p-8 rounded-2xl border-2 border-healing/30 hover:border-healing bg-white/80 backdrop-blur-sm hover:bg-healing/5 transition-all duration-300 cursor-pointer card-hover flex-1 max-w-md"
                      onClick={() => handleJoinAs('professional')}
                    >
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-healing/10 to-healing/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Stethoscope className="w-10 h-10 text-healing" />
                        </div>
                        <h3 className="text-xl font-bold text-healing">I'm a mental health professional</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your practice, connect with clients, and provide professional mental health services.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-healing font-medium">
                          <span>Join as Professional</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Lock className="w-3 h-3" />
                          <span>Permanent choice</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Choose carefully - this decision cannot be undone for this account.
                    </p>
                  </div>
                </div>
              )}

              {/* Sign in link for non-authenticated users */}
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
          )}

          {/* Trust Indicators - Only show for non-authenticated users */}
          {!showUserTypeChoice && !isUserTypeLocked && (
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
          )}

          {/* Visual Elements */}
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