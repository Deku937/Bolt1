'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { SessionBooking } from '@/components/dashboard/patient/session-booking';
import { UpcomingSessions } from '@/components/dashboard/patient/upcoming-sessions';

export default function PatientSessionsPage() {
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">My Sessions</h1>
          <p className="text-muted-foreground">Manage your therapy sessions and book new appointments</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingSessions />
          <div className="space-y-6">
            <SessionBooking />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}