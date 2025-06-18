'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/providers/language-provider';
import { 
  UserCheck, 
  TrendingUp, 
  BookOpen, 
  Shield, 
  Calendar, 
  MessageCircle,
  Clock,
  Globe,
  Sparkles,
  Zap,
  Heart
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function FeaturesSection() {
  const { t } = useLanguage();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: UserCheck,
      title: t('features.professional.title'),
      description: t('features.professional.desc'),
      color: 'text-primary',
      bgColor: 'from-primary/10 to-primary/5',
      borderColor: 'border-primary/20'
    },
    {
      icon: TrendingUp,
      title: t('features.tracking.title'),
      description: t('features.tracking.desc'),
      color: 'text-healing',
      bgColor: 'from-healing/10 to-healing/5',
      borderColor: 'border-healing/20'
    },
    {
      icon: BookOpen,
      title: t('features.resources.title'),
      description: t('features.resources.desc'),
      color: 'text-warm',
      bgColor: 'from-warm/10 to-warm/5',
      borderColor: 'border-warm/20'
    },
    {
      icon: Shield,
      title: t('features.secure.title'),
      description: t('features.secure.desc'),
      color: 'text-primary',
      bgColor: 'from-primary/10 to-primary/5',
      borderColor: 'border-primary/20'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Book sessions that fit your schedule with intelligent availability matching',
      color: 'text-healing',
      bgColor: 'from-healing/10 to-healing/5',
      borderColor: 'border-healing/20'
    },
    {
      icon: MessageCircle,
      title: '24/7 Crisis Support',
      description: 'Immediate access to crisis intervention and emergency resources',
      color: 'text-warm',
      bgColor: 'from-warm/10 to-warm/5',
      borderColor: 'border-warm/20'
    },
    {
      icon: Clock,
      title: 'Flexible Sessions',
      description: 'Choose from video, audio, or text-based therapy sessions',
      color: 'text-primary',
      bgColor: 'from-primary/10 to-primary/5',
      borderColor: 'border-primary/20'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Access support in multiple languages from diverse professionals',
      color: 'text-healing',
      bgColor: 'from-healing/10 to-healing/5',
      borderColor: 'border-healing/20'
    }
  ];

  return (
    <section id="features" className="py-24 px-4 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-healing/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-warm/3 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-healing/10 animate-bounce-gentle">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient animate-gradient">
              {t('features.title')}
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
          
          {/* Decorative line */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-healing to-warm rounded-full animate-shimmer"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              data-index={index}
              className={`feature-card group glass-effect border-0 ${feature.borderColor} card-hover relative overflow-hidden ${
                visibleCards.includes(index) ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <CardContent className="p-8 text-center space-y-6 relative z-10">
                {/* Icon with enhanced styling */}
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgColor} group-hover:scale-110 transition-all duration-300 relative`}>
                    <feature.icon className={`w-8 h-8 ${feature.color} group-hover:animate-bounce-gentle`} />
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgColor} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  </div>
                  
                  {/* Floating sparkles */}
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Interactive element */}
                <div className="flex justify-center">
                  <div className={`w-8 h-1 bg-gradient-to-r ${feature.bgColor.replace('/10', '/30').replace('/5', '/20')} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                </div>
              </CardContent>
              
              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-gradient transition-all duration-300"></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-effect border border-primary/20">
            <Heart className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Trusted by thousands of users worldwide
            </span>
            <Zap className="w-5 h-5 text-healing animate-bounce-gentle" />
          </div>
        </div>
      </div>
    </section>
  );
}