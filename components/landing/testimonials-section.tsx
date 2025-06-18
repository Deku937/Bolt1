'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, Heart, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
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

    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Patient',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'MindWell changed my life. The platform made it so easy to find the right therapist and track my progress. I feel more in control of my mental health than ever before.',
      rating: 5,
      highlight: 'Life-changing experience'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Licensed Therapist',
      avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'As a professional, I appreciate how MindWell streamlines my practice while maintaining the highest standards of patient care and privacy.',
      rating: 5,
      highlight: 'Professional excellence'
    },
    {
      name: 'Emma Thompson',
      role: 'Patient',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'The mood tracking feature helped me identify patterns I never noticed before. Combined with my therapist sessions, it\'s been incredibly insightful.',
      rating: 5,
      highlight: 'Incredible insights'
    }
  ];

  return (
    <section className="py-24 px-4 gradient-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-healing/10 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-warm/10 rounded-full blur-xl animate-pulse-slow"></div>
        
        {/* Floating quotes */}
        <div className="absolute top-20 left-20 opacity-10">
          <Quote className="w-16 h-16 text-primary animate-float" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10">
          <Quote className="w-12 h-12 text-healing animate-float-delayed" />
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-healing/10 to-warm/10 animate-bounce-gentle">
              <Heart className="w-8 h-8 text-healing" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient animate-gradient">
              Trusted by Thousands
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how MindWell is making a difference in people's mental health journey
          </p>
          
          {/* Rating summary */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-2xl font-bold text-gradient">4.9</span>
            <span className="text-muted-foreground">from 1,200+ reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              data-index={index}
              className={`testimonial-card glass-effect border-0 card-hover relative overflow-hidden group ${
                visibleCards.includes(index) ? 'animate-scale-in' : 'opacity-0'
              } ${
                activeTestimonial === index ? 'ring-2 ring-primary/30 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-healing/5 to-warm/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="p-8 space-y-6 relative z-10">
                {/* Rating with animation */}
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:animate-bounce-gentle" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                
                {/* Quote with enhanced styling */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors duration-300" />
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6 group-hover:text-foreground/80 transition-colors duration-300">
                    "{testimonial.content}"
                  </p>
                </div>
                
                {/* Highlight badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-healing/10 border border-primary/20">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-primary">{testimonial.highlight}</span>
                </div>
                
                {/* Author info with enhanced styling */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-healing/10">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-sm group-hover:text-gradient transition-all duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                  
                  {/* Verified badge */}
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Verified
                  </div>
                </div>
              </CardContent>
              
              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-gradient transition-all duration-300"></div>
            </Card>
          ))}
        </div>

        {/* Testimonial indicators */}
        <div className="flex justify-center gap-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeTestimonial === index 
                  ? 'bg-primary scale-125' 
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
            />
          ))}
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in">
          {[
            { number: '98%', label: 'Satisfaction Rate', icon: Heart },
            { number: '24/7', label: 'Support Available', icon: Sparkles },
            { number: '50+', label: 'Countries Served', icon: Star },
            { number: '1M+', label: 'Lives Improved', icon: Heart }
          ].map((stat, index) => (
            <div key={index} className="space-y-3 group">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-healing/10 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gradient">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}