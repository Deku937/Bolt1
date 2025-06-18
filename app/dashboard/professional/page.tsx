'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ProfessionalOverview } from '@/components/dashboard/professional/professional-overview';
import { SessionRequests } from '@/components/dashboard/professional/session-requests';
import { TodaySchedule } from '@/components/dashboard/professional/today-schedule';
import { ClientProgress } from '@/components/dashboard/professional/client-progress';
import { ProfessionalStats } from '@/components/dashboard/professional/professional-stats';

export default function ProfessionalDashboard() {
  return (
    <DashboardLayout userType="professional">
      <div className="space-y-8">
        <ProfessionalOverview />
        <ProfessionalStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SessionRequests />
          <TodaySchedule />
        </div>
        
        <ClientProgress />
      </div>
    </DashboardLayout>
  );
}