'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { TodaySchedule } from '@/components/dashboard/professional/today-schedule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

export default function ProfessionalCalendarPage() {
  return (
    <DashboardLayout userType="professional">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and appointments</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodaySchedule />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warm" />
                Availability Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your availability and booking preferences here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}