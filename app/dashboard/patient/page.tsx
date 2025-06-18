'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { PatientOverview } from '@/components/dashboard/patient/patient-overview';
import { QuickActions } from '@/components/dashboard/patient/quick-actions';
import { EnhancedMoodTracker } from '@/components/dashboard/patient/enhanced-mood-tracker';
import { UpcomingSessions } from '@/components/dashboard/patient/upcoming-sessions';
import { RecommendedContent } from '@/components/dashboard/patient/recommended-content';
import { TokenBalance } from '@/components/dashboard/patient/token-balance';

export default function PatientDashboard() {
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-8">
        <PatientOverview />
        <QuickActions />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnhancedMoodTracker />
          </div>
          <div className="space-y-6">
            <TokenBalance />
            <UpcomingSessions />
          </div>
        </div>
        
        <RecommendedContent />
      </div>
    </DashboardLayout>
  );
}