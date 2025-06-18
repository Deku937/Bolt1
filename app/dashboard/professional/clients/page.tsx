'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ClientProgress } from '@/components/dashboard/professional/client-progress';

export default function ProfessionalClientsPage() {
  return (
    <DashboardLayout userType="professional">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and track their progress</p>
        </div>
        
        <ClientProgress />
      </div>
    </DashboardLayout>
  );
}