'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { SessionRequests } from '@/components/dashboard/professional/session-requests';
import { TodaySchedule } from '@/components/dashboard/professional/today-schedule';

export default function ProfessionalSessionsPage() {
  return (
    <DashboardLayout userType="professional">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Sessions</h1>
          <p className="text-muted-foreground">Manage session requests and your daily schedule</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SessionRequests />
          <TodaySchedule />
        </div>
      </div>
    </DashboardLayout>
  );
}