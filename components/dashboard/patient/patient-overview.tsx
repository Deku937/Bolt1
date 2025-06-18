'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, BookOpen } from 'lucide-react';

export function PatientOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Next Session</p>
              <p className="text-xl md:text-2xl font-bold">Tomorrow</p>
              <p className="text-xs text-muted-foreground truncate">with Dr. Sarah Chen</p>
            </div>
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Mood Streak</p>
              <p className="text-xl md:text-2xl font-bold">7 days</p>
              <Badge variant="secondary" className="mt-1 text-xs">Great progress!</Badge>
            </div>
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-healing flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Sessions Completed</p>
              <p className="text-xl md:text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground truncate">This month</p>
            </div>
            <Users className="w-6 h-6 md:w-8 md:h-8 text-warm flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Resources Read</p>
              <p className="text-xl md:text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground truncate">This week</p>
            </div>
            <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}