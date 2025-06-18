'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Video, Phone, MessageSquare, Star, Filter, Coins, CreditCard, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SimpleCreditCardForm } from '@/components/payment/simple-credit-card-form';
import { tokenService, UserTokens } from '@/lib/tokens';
import { formatPrice, getSessionPrice } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';

interface Professional {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  experience: string;
  languages: string[];
  sessionTypes: string[];
  availability: string[];
  price: number;
  tokenPrice?: number;
  bio: string;
}

interface BookingDetails {
  professional: Professional;
  slot: string;
  type: string;
  duration: number;
  paymentMethod: 'tokens' | 'stripe';
}

export function EnhancedSessionBooking() {
  const { user } = useAuth();
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState<'tokens' | 'stripe'>('stripe');
  const [tokens, setTokens] = useState<UserTokens | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setTokens(tokenService.getUserTokens());
  }, []);

  const professionals: Professional[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialty: 'Anxiety & Depression',
      rating: 4.9,
      experience: '8 years',
      languages: ['English', 'Mandarin'],
      sessionTypes: ['video', 'audio', 'chat'],
      availability: ['Tomorrow 2:00 PM', 'Friday 10:00 AM', 'Monday 3:00 PM'],
      price: 120,
      tokenPrice: 500,
      bio: 'Specialized in cognitive behavioral therapy with extensive experience in treating anxiety and depression.'
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialty: 'Stress Management',
      rating: 4.8,
      experience: '12 years',
      languages: ['English', 'Spanish'],
      sessionTypes: ['video', 'audio'],
      availability: ['Today 4:00 PM', 'Thursday 11:00 AM', 'Saturday 9:00 AM'],
      price: 150,
      tokenPrice: 600,
      bio: 'Expert in stress management and workplace mental health with a focus on mindfulness-based interventions.'
    },
    {
      id: '3',
      name: 'Dr. Emily Johnson',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialty: 'Relationship Counseling',
      rating: 4.7,
      experience: '6 years',
      languages: ['English', 'French'],
      sessionTypes: ['video', 'chat'],
      availability: ['Wednesday 1:00 PM', 'Friday 3:00 PM', 'Sunday 10:00 AM'],
      price: 100,
      tokenPrice: 400,
      bio: 'Specializes in couples therapy and relationship counseling using evidence-based approaches.'
    }
  ];

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || prof.specialty.includes(specialtyFilter);
    return matchesSearch && matchesSpecialty;
  });

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Phone className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const calculatePrice = (professional: Professional, duration: number) => {
    const basePrice = professional.price;
    const typeMultiplier = selectedType === 'audio' ? 0.85 : selectedType === 'chat' ? 0.7 : 1.0;
    const durationMultiplier = duration === 75 ? 1.5 : duration === 30 ? 0.6 : 1.0;
    return basePrice * typeMultiplier * durationMultiplier;
  };

  const calculateTokenPrice = (professional: Professional, duration: number) => {
    const baseTokens = professional.tokenPrice || 500;
    const multiplier = duration === 75 ? 1.5 : duration === 30 ? 0.6 : 1;
    return Math.round(baseTokens * multiplier);
  };

  const handleBookSession = async () => {
    if (!selectedProfessional || !selectedSlot || !selectedType) {
      toast.error('Please select all required fields');
      return;
    }

    if (!user) {
      toast.error('Please sign in to book a session');
      return;
    }

    setIsBooking(true);

    try {
      if (paymentMethod === 'tokens') {
        const tokenPrice = calculateTokenPrice(selectedProfessional, selectedDuration);
        
        if (!tokens || tokens.balance < tokenPrice) {
          toast.error('Insufficient tokens for this session');
          setIsBooking(false);
          return;
        }

        // Process token payment immediately
        const newTokens = tokenService.spendTokens(
          tokenPrice,
          `Session with ${selectedProfessional.name}`,
          'session'
        );
        
        if (newTokens) {
          setTokens(newTokens);
          toast.success(`🎉 Session booked with tokens! ${selectedProfessional.name} - ${selectedSlot}`);
          resetForm();
        }
      } else {
        // For Stripe payment, prepare booking details and show payment form
        const details: BookingDetails = {
          professional: selectedProfessional,
          slot: selectedSlot,
          type: selectedType,
          duration: selectedDuration,
          paymentMethod: paymentMethod
        };
        
        setBookingDetails(details);
        setIsDialogOpen(false);
        setShowPaymentForm(true);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book session');
    } finally {
      setIsBooking(false);
    }
  };

  const resetForm = () => {
    setSelectedProfessional(null);
    setSelectedSlot('');
    setSelectedType('');
    setSelectedDuration(50);
    setPaymentMethod('stripe');
    setShowPaymentForm(false);
    setBookingDetails(null);
    setIsDialogOpen(false);
  };

  const handlePaymentFinalize = () => {
    setShowPaymentForm(false);
    toast.success(`🎉 Payment successful! Session booked with ${bookingDetails?.professional.name} - ${bookingDetails?.slot}`);
    resetForm();
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setBookingDetails(null);
    // Don't reset other form fields, user can try again
  };

  // If payment form is shown, render the credit card form
  if (showPaymentForm && bookingDetails) {
    return (
      <SimpleCreditCardForm
        bookingDetails={bookingDetails}
        onFinalize={handlePaymentFinalize}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Book a Therapy Session
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Find and book sessions with licensed mental health professionals using money or tokens
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter - Mobile Optimized */}
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Search professionals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="Anxiety">Anxiety & Depression</SelectItem>
              <SelectItem value="Stress">Stress Management</SelectItem>
              <SelectItem value="Relationship">Relationship Counseling</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Token Balance Display - Mobile Optimized */}
        {tokens && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Token Balance:</span>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-primary" />
                <span className="font-bold">{tokens.balance}</span>
              </div>
            </div>
          </div>
        )}

        {/* Professionals List - Mobile Optimized */}
        <div className="space-y-4">
          {filteredProfessionals.map((professional) => {
            const priceUsd = calculatePrice(professional, selectedDuration);
            const priceTokens = calculateTokenPrice(professional, selectedDuration);
            
            return (
              <div key={professional.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                {/* Mobile-First Layout */}
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={professional.avatar} alt={professional.name} />
                      <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base leading-tight">{professional.name}</h4>
                      <p className="text-sm text-muted-foreground">{professional.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{professional.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{professional.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section - Stacked on Mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-base font-bold">${priceUsd.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Coins className="w-3 h-3" />
                        <span>{priceTokens} tokens</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio - Truncated on Mobile */}
                  <p className="text-sm text-muted-foreground line-clamp-2">{professional.bio}</p>
                  
                  {/* Languages - Responsive */}
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs font-medium">Languages:</span>
                    {professional.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Session Types - Responsive */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-medium">Types:</span>
                    {professional.sessionTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getSessionIcon(type)}
                        <span className="capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Availability - Mobile Optimized */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium">Available:</span>
                    <div className="flex flex-wrap gap-1">
                      {professional.availability.slice(0, 2).map((slot, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {slot}
                        </Badge>
                      ))}
                      {professional.availability.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{professional.availability.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Book Button - Full Width on Mobile */}
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setSelectedProfessional(professional);
                          setIsDialogOpen(true);
                        }}
                        className="w-full bg-healing hover:bg-healing/90"
                      >
                        Book Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-base">Book Session with {professional.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Duration Selection */}
                        <div>
                          <label className="text-sm font-medium">Session Duration</label>
                          <Select value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(parseInt(value))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="50">50 minutes (Standard)</SelectItem>
                              <SelectItem value="75">75 minutes (Extended)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Payment Method Selection */}
                        <div>
                          <label className="text-sm font-medium">Payment Method</label>
                          <Select value={paymentMethod} onValueChange={(value: 'tokens' | 'stripe') => setPaymentMethod(value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stripe">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  <span>Credit Card - ${calculatePrice(professional, selectedDuration).toFixed(2)}</span>
                                </div>
                              </SelectItem>
                              <SelectItem 
                                value="tokens" 
                                disabled={!tokens || tokens.balance < calculateTokenPrice(professional, selectedDuration)}
                              >
                                <div className="flex items-center gap-2">
                                  <Coins className="w-4 h-4" />
                                  <span>Tokens - {calculateTokenPrice(professional, selectedDuration)}</span>
                                  {(!tokens || tokens.balance < calculateTokenPrice(professional, selectedDuration)) && (
                                    <span className="text-red-500 text-xs">(Insufficient)</span>
                                  )}
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Date & Time Selection - Fixed */}
                        <div>
                          <label className="text-sm font-medium">Select Date & Time</label>
                          <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Choose available slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {professional.availability.map((slot, index) => (
                                <SelectItem key={index} value={slot}>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{slot}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedSlot && (
                            <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 text-sm text-green-700">
                                <Clock className="w-4 h-4" />
                                <span>Selected: {selectedSlot}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Session Type Selection */}
                        <div>
                          <label className="text-sm font-medium">Session Type</label>
                          <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Choose session type" />
                            </SelectTrigger>
                            <SelectContent>
                              {professional.sessionTypes.map((type, index) => (
                                <SelectItem key={index} value={type}>
                                  <div className="flex items-center gap-2">
                                    {getSessionIcon(type)}
                                    <span className="capitalize">{type} Session</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Price Summary - Mobile Optimized */}
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Cost:</span>
                              {paymentMethod === 'tokens' ? (
                                <div className="flex items-center gap-1">
                                  <Coins className="w-4 h-4 text-primary" />
                                  <span className="font-bold">{calculateTokenPrice(professional, selectedDuration)}</span>
                                </div>
                              ) : (
                                <span className="font-bold">${calculatePrice(professional, selectedDuration).toFixed(2)}</span>
                              )}
                            </div>
                            {paymentMethod === 'tokens' && tokens && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Remaining balance:</span>
                                <div className="flex items-center gap-1">
                                  <Coins className="w-4 h-4 text-primary" />
                                  <span className="font-bold">{tokens.balance - calculateTokenPrice(professional, selectedDuration)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleBookSession} 
                          className="w-full"
                          disabled={isBooking || !selectedSlot || !selectedType}
                        >
                          {isBooking ? 'Processing...' : paymentMethod === 'tokens' ? 'Book with Tokens' : 'Proceed to Payment'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No professionals found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}