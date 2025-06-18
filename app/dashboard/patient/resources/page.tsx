'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EnhancedRecommendedContent } from '@/components/dashboard/patient/enhanced-recommended-content';

export default function PatientResourcesPage() {
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground">Access self-help materials, guided meditations, and educational content. Earn tokens by completing activities!</p>
        </div>
        
        <EnhancedRecommendedContent />
      </div>
    </DashboardLayout>
  );
}