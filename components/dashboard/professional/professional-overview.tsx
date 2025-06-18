'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';

export function ProfessionalOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Today's Sessions</p>
              <p className="text-xl md:text-2xl font-bold">6</p>
              <p className="text-xs text-muted-foreground truncate">2 pending requests</p>
            </div>
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Active Clients</p>
              <p className="text-xl md:text-2xl font-bold">24</p>
              <Badge variant="secondary" className="mt-1 text-xs">+3 this week</Badge>
            </div>
            <Users className="w-6 h-6 md:w-8 md:h-8 text-healing flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Hours This Week</p>
              <p className="text-xl md:text-2xl font-bold">32</p>
              <p className="text-xs text-muted-foreground truncate">8 hours remaining</p>
            </div>
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-warm flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Client Satisfaction</p>
              <p className="text-xl md:text-2xl font-bold">4.9</p>
              <p className="text-xs text-muted-foreground truncate">Based on 45 reviews</p>
            </div>
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}