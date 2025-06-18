'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Calendar, MessageSquare, Check, X } from 'lucide-react';

export function SessionRequests() {
  const requests = [
    {
      id: 1,
      client: {
        name: 'Emma Thompson',
        avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
        joinedDate: '2 weeks ago'
      },
      requestedDate: 'Tomorrow',
      requestedTime: '2:00 PM',
      sessionType: 'video',
      reason: 'Follow-up on anxiety management techniques',
      priority: 'normal'
    },
    {
      id: 2,
      client: {
        name: 'James Wilson',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        joinedDate: '1 month ago'
      },
      requestedDate: 'Friday',
      requestedTime: '10:00 AM',
      sessionType: 'audio',
      reason: 'New patient - initial consultation',
      priority: 'high'
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="min-w-0 flex-1">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-warm flex-shrink-0" />
            <span className="truncate">Session Requests</span>
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Pending client requests</p>
        </div>
        <Badge variant="secondary" className="text-xs flex-shrink-0">{requests.length} pending</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="p-3 md:p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Header Section - Mobile Optimized */}
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <AvatarImage src={request.client.avatar} alt={request.client.name} />
                  <AvatarFallback>{request.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm md:text-base truncate pr-2">{request.client.name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">Joined {request.client.joinedDate}</p>
                    </div>
                    {/* Priority Badge - Fixed positioning */}
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={request.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs whitespace-nowrap relative z-10"
                      >
                        {request.priority} priority
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Session Details - Stacked on Mobile */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>{request.requestedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>{request.requestedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="capitalize">{request.sessionType}</span>
                  </div>
                </div>
                
                <p className="text-xs md:text-sm text-foreground line-clamp-2">{request.reason}</p>
              </div>
              
              {/* Action Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" className="bg-healing hover:bg-healing/90 flex-1 sm:flex-none">
                  <Check className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">Accept</span>
                </Button>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                  <span className="text-xs md:text-sm">Suggest Time</span>
                </Button>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                  <X className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">Decline</span>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 md:w-12 md:h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm md:text-base text-muted-foreground">No pending session requests</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}