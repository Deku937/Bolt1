'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Video, Phone, MessageSquare } from 'lucide-react';

export function TodaySchedule() {
  const todaySessions = [
    {
      id: 1,
      time: '9:00 AM',
      client: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      type: 'video',
      duration: 50,
      status: 'confirmed'
    },
    {
      id: 2,
      time: '11:00 AM',
      client: {
        name: 'Michael Chen',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      type: 'audio',
      duration: 50,
      status: 'confirmed'
    },
    {
      id: 3,
      time: '2:00 PM',
      client: {
        name: 'Emma Davis',
        avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      type: 'video',
      duration: 50,
      status: 'upcoming'
    },
    {
      id: 4,
      time: '4:00 PM',
      client: {
        name: 'David Wilson',
        avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      type: 'chat',
      duration: 30,
      status: 'upcoming'
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
            <span className="truncate">Today's Schedule</span>
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">{todaySessions.length} sessions scheduled</p>
        </div>
        <Button size="sm" variant="outline" className="text-xs md:text-sm flex-shrink-0">
          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Manage</span>
          <span className="sm:hidden">Edit</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {todaySessions.map((session) => (
          <div key={session.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            {/* Time Section - Fixed Width */}
            <div className="text-center min-w-[60px] md:min-w-[80px] flex-shrink-0">
              <p className="text-xs md:text-sm font-medium">{session.time}</p>
              <p className="text-xs text-muted-foreground">{session.duration}min</p>
            </div>
            
            {/* Avatar */}
            <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
              <AvatarImage src={session.client.avatar} alt={session.client.name} />
              <AvatarFallback className="text-xs">{session.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            {/* Client Info - Flexible Layout */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Name Row */}
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm md:text-base truncate flex-1 pr-2">{session.client.name}</h4>
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
              
              {/* Session Type Row */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getSessionIcon(session.type)}
                <span className="capitalize">{session.type}</span>
              </div>
            </div>
            
            {/* Action Buttons - Responsive Stack */}
            <div className="flex flex-col gap-1 flex-shrink-0 min-w-[60px] md:min-w-[80px]">
              {session.status === 'upcoming' && (
                <Button size="sm" className="text-xs px-2 h-7 w-full">
                  <span className="hidden sm:inline">Start</span>
                  <span className="sm:hidden">▶</span>
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-xs px-2 h-7 w-full">
                <span className="hidden sm:inline">Notes</span>
                <span className="sm:hidden">📝</span>
              </Button>
            </div>
          </div>
        ))}

        {todaySessions.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-8 h-8 md:w-12 md:h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm md:text-base text-muted-foreground">No sessions scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}