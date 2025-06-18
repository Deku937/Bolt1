'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Video, MessageSquare, Phone } from 'lucide-react';

export function UpcomingSessions() {
  const sessions = [
    {
      id: 1,
      professional: {
        name: 'Dr. Sarah Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        specialty: 'Anxiety & Depression'
      },
      date: 'Tomorrow',
      time: '2:00 PM',
      type: 'video',
      status: 'confirmed'
    },
    {
      id: 2,
      professional: {
        name: 'Dr. Michael Rodriguez',
        avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
        specialty: 'Stress Management'
      },
      date: 'Friday',
      time: '10:00 AM',
      type: 'audio',
      status: 'pending'
    }
  ];

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-3 h-3 md:w-4 md:h-4" />;
      case 'audio': return <Phone className="w-3 h-3 md:w-4 md:h-4" />;
      default: return <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="min-w-0 flex-1">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
            <span className="truncate">Upcoming Sessions</span>
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Your scheduled appointments</p>
        </div>
        <Button size="sm" className="text-xs md:text-sm flex-shrink-0">
          <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Book New</span>
          <span className="sm:hidden">Book</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="p-3 md:p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Header Section */}
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <AvatarImage src={session.professional.avatar} alt={session.professional.name} />
                  <AvatarFallback className="text-xs">{session.professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm md:text-base truncate pr-2">{session.professional.name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{session.professional.specialty}</p>
                    </div>
                    {/* Status Badge - Fixed positioning */}
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={session.status === 'confirmed' ? 'default' : 'secondary'}
                        className="text-xs whitespace-nowrap relative z-10"
                      >
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Session Details */}
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getSessionIcon(session.type)}
                  <span className="capitalize">{session.type}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-2 flex-1">
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs md:text-sm">
                    Reschedule
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs md:text-sm">
                    Message
                  </Button>
                </div>
                {session.status === 'confirmed' && (
                  <Button size="sm" className="w-full sm:w-auto text-xs md:text-sm">
                    Join Session
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-8 h-8 md:w-12 md:h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm md:text-base text-muted-foreground">No upcoming sessions</p>
            <Button className="mt-4 text-xs md:text-sm">Book Your First Session</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}