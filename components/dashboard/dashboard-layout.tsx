'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { AudioDescriptionToggle } from '@/components/ui/audio-description-toggle';
import { 
  Heart, 
  Home, 
  Calendar, 
  Users, 
  BookOpen, 
  Settings, 
  AlertCircle,
  Menu,
  X,
  TrendingUp,
  MessageSquare,
  User,
  LogOut,
  Coins,
  Sparkles,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAudioDescription } from '@/hooks/use-audio-description';
import { audioDescriptionService } from '@/lib/audio-description';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'patient' | 'professional';
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [greetingVisible, setGreetingVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Auto-describe page when mounted if enabled
    const settings = audioDescriptionService.getSettings();
    if (settings.enabled && settings.autoDescribe) {
      setTimeout(() => {
        audioDescriptionService.describePageContent();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state for header styling
      setScrolled(currentScrollY > 20);
      
      // Hide/show greeting based on scroll direction and position
      if (currentScrollY > 100) { // Start hiding after 100px scroll
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide greeting
          setGreetingVisible(false);
        } else {
          // Scrolling up - show greeting
          setGreetingVisible(true);
        }
      } else {
        // Near top - always show greeting
        setGreetingVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const patientNavItems = [
    { href: '/dashboard/patient', icon: Home, label: 'Dashboard', color: 'text-primary' },
    { href: '/dashboard/patient/sessions', icon: Calendar, label: 'My Sessions', color: 'text-healing' },
    { href: '/dashboard/patient/professionals', icon: Users, label: 'Find Professionals', color: 'text-warm' },
    { href: '/dashboard/patient/mood', icon: TrendingUp, label: 'Mood Tracking', color: 'text-primary' },
    { href: '/dashboard/patient/tokens', icon: Coins, label: 'My Tokens', color: 'text-healing' },
    { href: '/dashboard/patient/resources', icon: BookOpen, label: 'Resources', color: 'text-warm' },
    { href: '/dashboard/patient/messages', icon: MessageSquare, label: 'Messages', color: 'text-primary' },
  ];

  const professionalNavItems = [
    { href: '/dashboard/professional', icon: Home, label: 'Dashboard', color: 'text-primary' },
    { href: '/dashboard/professional/calendar', icon: Calendar, label: 'Calendar', color: 'text-healing' },
    { href: '/dashboard/professional/clients', icon: Users, label: 'Clients', color: 'text-warm' },
    { href: '/dashboard/professional/sessions', icon: MessageSquare, label: 'Sessions', color: 'text-primary' },
    { href: '/dashboard/professional/resources', icon: BookOpen, label: 'Resources', color: 'text-healing' },
  ];

  const navItems = userType === 'patient' ? patientNavItems : professionalNavItems;

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="skeleton h-16 w-full"></div>
        <div className="flex">
          <div className="skeleton w-64 h-screen"></div>
          <div className="flex-1 p-6">
            <div className="skeleton h-8 w-1/3 mb-4"></div>
            <div className="skeleton h-4 w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 md:w-72 glass-effect border-r transform transition-all duration-300 ease-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
          <Link 
            href="/" 
            className="flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl group"
            aria-label="MindWell home page"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-healing rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
              <Heart className="w-4 h-4 md:w-6 md:h-6 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-healing rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <span className="text-gradient animate-gradient">
              MindWell
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>

        {/* User Info Card */}
        <div className="p-4 md:p-6 border-b border-white/10">
          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-gradient-to-r from-primary/10 to-healing/10 border border-white/20">
            <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-primary/30 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary to-healing text-white font-semibold text-sm md:text-base">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs md:text-sm truncate">Welcome back,</p>
              <p className="text-base md:text-lg font-bold text-gradient truncate">{getUserName()}!</p>
              <p className="text-xs text-muted-foreground capitalize">{userType}</p>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary animate-bounce-gentle" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 md:p-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar" role="navigation" aria-label="Dashboard navigation">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 text-sm rounded-xl hover:bg-white/10 transition-all duration-200 group relative overflow-hidden"
              onClick={() => setSidebarOpen(false)}
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-label={`Navigate to ${item.label}`}
            >
              {/* Hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-healing/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              <div className={`p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 group-hover:scale-110 transition-transform duration-200 relative z-10 flex-shrink-0`}>
                <item.icon className={`w-4 h-4 md:w-5 md:h-5 ${item.color} group-hover:animate-bounce-gentle`} />
              </div>
              <span className="font-medium relative z-10 group-hover:text-gradient transition-all duration-200 truncate">
                {item.label}
              </span>
              
              {/* Active indicator */}
              <div className="absolute right-2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 md:p-6 space-y-3 border-t border-white/10">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 button-glow group text-xs md:text-sm"
            aria-label="Emergency support - immediate help available"
          >
            <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-2 group-hover:animate-pulse" />
            Emergency Support
          </Button>
          <Link href="/dashboard/settings">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start hover:bg-white/10 group text-xs md:text-sm"
              aria-label="Settings and preferences"
            >
              <Settings className="w-3 h-3 md:w-4 md:h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 xl:pl-72">
        {/* Enhanced Top bar with scroll-responsive greeting - NOTIFICATION SUPPRIMÉE */}
        <header className={cn(
          "sticky top-0 z-30 glass-effect border-b border-white/10 px-4 md:px-6 transition-all duration-300",
          scrolled ? "py-2 md:py-3 shadow-lg" : "py-3 md:py-4"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-white/10"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar navigation"
              >
                <Menu className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              
              {/* Greeting with scroll-triggered visibility */}
              <div className={cn(
                "transition-all duration-500 ease-in-out overflow-hidden",
                greetingVisible 
                  ? "opacity-100 transform translate-y-0 max-h-20" 
                  : "opacity-0 transform -translate-y-4 max-h-0"
              )}>
                <div className="animate-slide-up">
                  <h1 className="text-lg md:text-2xl font-bold text-gradient">
                    Welcome
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Search - Hidden on mobile */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-48 xl:w-64 bg-white/50 border-white/20 focus:bg-white/80 transition-all duration-200"
                  aria-label="Search dashboard content"
                />
              </div>

              {/* NOTIFICATION SUPPRIMÉE - Plus d'icône Bell */}

              <AudioDescriptionToggle />
              <LanguageToggle />
              <ThemeToggle />
              
              {/* Enhanced User Menu - DÉPLACÉ PLUS À GAUCHE */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-white/10 group"
                    aria-label={`User menu for ${profile?.first_name || user?.email}`}
                  >
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-200">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-healing text-white font-semibold text-xs md:text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 md:w-64 glass-effect border-white/20" align="end" forceMount>
                  <div className="flex flex-col space-y-2 p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-healing text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none truncate">
                          {profile?.first_name && profile?.last_name 
                            ? `${profile.first_name} ${profile.last_name}`
                            : user?.email
                          }
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                          {user?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {profile?.user_type && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={profile.user_type === 'patient' ? '/dashboard/patient' : '/dashboard/professional'} className="flex items-center gap-3">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                          <Sparkles className="w-3 h-3 ml-auto text-primary" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Enhanced Page content */}
        <main className="p-4 md:p-6 animate-fade-in" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}