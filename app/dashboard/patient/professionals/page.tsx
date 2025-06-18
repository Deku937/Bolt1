'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EnhancedSessionBooking } from '@/components/dashboard/patient/enhanced-session-booking';

export default function PatientProfessionalsPage() {
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Find Professionals</h1>
          <p className="text-muted-foreground">Browse and connect with licensed mental health professionals using money or tokens</p>
        </div>
        
        <EnhancedSessionBooking />
      </div>
    </DashboardLayout>
  );
}