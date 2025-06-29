'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { AudioDescriptionToggle } from '@/components/ui/audio-description-toggle';
import { useLanguage } from '@/providers/language-provider';
import { Heart, Menu, X, User, LogOut, Sparkles, Zap, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Enhanced Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 font-bold text-xl group"
          aria-label="MindWell home page"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-healing rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative">
            <Heart className="w-6 h-6 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-healing rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <span className="text-gradient animate-gradient">
            MindWell
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
          {[
            { href: '/#features', label: t('nav.features') },
            { href: '/#about', label: t('nav.about') },
            { href: '/#contact', label: t('nav.contact') }
          ].map((item, index) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-sm font-medium hover:text-primary transition-all duration-200 relative group"
              aria-label={`Navigate to ${item.label} section`}
            >
              {item.label}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-healing group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Bolt Badge */}
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs font-medium hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group"
            aria-label="Built with Bolt - Open in new tab"
          >
            <Zap className="w-3 h-3 group-hover:animate-pulse" />
            <span>Built with Bolt</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <AudioDescriptionToggle />
          <LanguageToggle />
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-3">
              {/* Enhanced User Menu - Fixed for Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full hover:bg-white/10 group"
                    aria-label={`User menu for ${profile?.first_name || user.email}`}
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-200">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-healing text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-72 glass-effect border-white/20" 
                  align="end" 
                  forceMount
                  sideOffset={8}
                  alignOffset={-4}
                >
                  <div className="flex flex-col space-y-2 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-healing text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-sm font-medium leading-none truncate">
                          {profile?.first_name && profile?.last_name 
                            ? `${profile.first_name} ${profile.last_name}`
                            : user.email
                          }
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                          {user.email}
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
                          <span>{t('nav.dashboard')}</span>
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
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="hover:bg-white/10 button-glow">
                <Link href="/sign-in">{t('nav.signin')}</Link>
              </Button>
              <Button asChild className="btn-primary button-glow">
                <Link href="/sign-up">
                  {t('nav.signup')}
                  <Sparkles className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Enhanced Mobile Menu - Fixed Overflow Issues */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect border-t border-white/10 animate-slide-up max-h-[calc(100vh-4rem)] overflow-y-auto" role="navigation" aria-label="Mobile navigation">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Navigation Links */}
            <div className="space-y-4">
              {[
                { href: '/#features', label: t('nav.features') },
                { href: '/#about', label: t('nav.about') },
                { href: '/#contact', label: t('nav.contact') }
              ].map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm font-medium hover:text-primary transition-colors py-2 border-b border-white/10 last:border-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  aria-label={`Navigate to ${item.label} section`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Bolt Badge - Mobile */}
            <div className="flex justify-center pt-4 border-t border-white/10">
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-medium hover:scale-105 transition-all duration-200 shadow-lg"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Built with Bolt - Open in new tab"
              >
                <Zap className="w-4 h-4" />
                <span>Built with Bolt</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
              <AudioDescriptionToggle />
              <LanguageToggle />
              <ThemeToggle />
            </div>
            
            {/* User Actions - Mobile Optimized with Fixed Overflow */}
            {user ? (
              <div className="space-y-4 pt-4 border-t border-white/10">
                {/* User Info Card - Mobile Friendly - FIXED CONTAINER */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 mx-auto max-w-full">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/30 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-healing text-white font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-sm font-medium leading-none truncate">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : user.email
                      }
                    </p>
                    <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Button */}
                {profile?.user_type && (
                  <Button asChild className="w-full btn-primary">
                    <Link
                      href={profile.user_type === 'patient' ? '/dashboard/patient' : '/dashboard/professional'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="mr-2 w-4 h-4" />
                      {t('nav.dashboard')}
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                )}

                {/* Sign Out Button */}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }} 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <Button variant="ghost" asChild className="w-full hover:bg-white/10">
                  <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    {t('nav.signin')}
                  </Link>
                </Button>
                <Button asChild className="w-full btn-primary">
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    {t('nav.signup')}
                    <Sparkles className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}