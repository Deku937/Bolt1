'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { AudioDescriptionToggle } from '@/components/ui/audio-description-toggle';
import { useLanguage } from '@/providers/language-provider';
import { Heart, Menu, X, User, LogOut, Sparkles, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAudioDescription } from '@/hooks/use-audio-description';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  
  // Si vous utilisez vraiment useAudioDescription, vous devrez adapter son typage
  // const { elementRef: logoRef } = useAudioDescription<HTMLAnchorElement>();
  // const { elementRef: menuRef } = useAudioDescription<HTMLButtonElement>();

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
          ref={logoRef}
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

        {/* Le reste du code reste inchangé */}
        {/* ... */}
      </div>
    </header>
  );
}