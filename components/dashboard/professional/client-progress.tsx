'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, MessageSquare, FileText } from 'lucide-react';

export function ClientProgress() {
  const clients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      sessionsCompleted: 8,
      totalSessions: 12,
      lastSession: '2 days ago',
      progress: 'improving',
      moodTrend: 'up',
      goals: ['Reduce anxiety', 'Better sleep']
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      sessionsCompleted: 15,
      totalSessions: 20,
      lastSession: '1 week ago',
      progress: 'stable',
      moodTrend: 'stable',
      goals: ['Stress management', 'Work-life balance']
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      sessionsCompleted: 4,
      totalSessions: 10,
      lastSession: '3 days ago',
      progress: 'early',
      moodTrend: 'up',
      goals: ['Build confidence', 'Social anxiety']
    }
  ];

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'improving': return 'text-healing';
      case 'stable': return 'text-primary';
      default: return 'text-warm';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="min-w-0 flex-1">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-healing flex-shrink-0" />
            <span className="truncate">Client Progress</span>
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Recent updates from your active clients</p>
        </div>
        <Button size="sm" variant="outline" className="text-xs md:text-sm flex-shrink-0">
          <span className="hidden sm:inline">View All Clients</span>
          <span className="sm:hidden">View All</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {clients.map((client) => (
          <div key={client.id} className="p-3 md:p-4 rounded-lg border">
            <div className="space-y-3 md:space-y-4">
              {/* Header Section */}
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback className="text-xs">{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm md:text-base truncate pr-2">{client.name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">Last session: {client.lastSession}</p>
                    </div>
                    {/* Progress Badge - Fixed positioning */}
                    <div className="flex-shrink-0">
                      <Badge 
                        variant="secondary" 
                        className={`${getProgressColor(client.progress)} text-xs whitespace-nowrap relative z-10`}
                      >
                        {client.progress}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span>Session Progress</span>
                  <span className="font-medium">{client.sessionsCompleted}/{client.totalSessions}</span>
                </div>
                <Progress 
                  value={(client.sessionsCompleted / client.totalSessions) * 100} 
                  className="h-2"
                />
              </div>
              
              {/* Goals Section */}
              <div className="space-y-2">
                <p className="text-xs md:text-sm font-medium">Current Goals:</p>
                <div className="flex flex-wrap gap-1">
                  {client.goals.map((goal, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">Message</span>
                </Button>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                  <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">Notes</span>
                </Button>
                <Button size="sm" className="flex-1 sm:flex-none">
                  <span className="text-xs md:text-sm">Schedule Session</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}