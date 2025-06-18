'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Video, Phone, MessageSquare, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  bio: string;
}

export function SessionBooking() {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

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

  const handleBookSession = () => {
    if (!selectedProfessional || !selectedDate || !selectedTime || !selectedType) {
      toast.error('Please select all required fields');
      return;
    }

    toast.success(`Session booked with ${selectedProfessional.name} for ${selectedDate} at ${selectedTime}`);
    setSelectedProfessional(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedType('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Book a Therapy Session
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Find and book sessions with licensed mental health professionals
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search professionals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-full sm:w-48">
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

        {/* Professionals List */}
        <div className="space-y-4">
          {filteredProfessionals.map((professional) => (
            <div key={professional.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={professional.avatar} alt={professional.name} />
                  <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{professional.name}</h4>
                      <p className="text-sm text-muted-foreground">{professional.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{professional.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{professional.experience} experience</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${professional.price}</p>
                      <p className="text-xs text-muted-foreground">per session</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{professional.bio}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">Languages:</span>
                      {professional.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Session types:</span>
                    {professional.sessionTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getSessionIcon(type)}
                        {type}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
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
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setSelectedProfessional(professional)}
                          className="bg-healing hover:bg-healing/90"
                        >
                          Book Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Book Session with {professional.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Select Date & Time</label>
                            <Select value={selectedDate + ' ' + selectedTime} onValueChange={(value) => {
                              const [date, time] = value.split(' at ');
                              setSelectedDate(date);
                              setSelectedTime(time);
                            }}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Choose available slot" />
                              </SelectTrigger>
                              <SelectContent>
                                {professional.availability.map((slot, index) => (
                                  <SelectItem key={index} value={slot.replace(' ', ' at ')}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
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
                                      {type.charAt(0).toUpperCase() + type.slice(1)} Session
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Session Fee:</span>
                              <span className="font-bold">${professional.price}</span>
                            </div>
                          </div>
                          
                          <Button onClick={handleBookSession} className="w-full">
                            Confirm Booking
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
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