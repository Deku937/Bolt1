'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { TokenBalance } from '@/components/dashboard/patient/token-balance';
import { TokenRewards } from '@/components/dashboard/patient/token-rewards';
import { TokenHistory } from '@/components/dashboard/patient/token-history';

export default function PatientTokensPage() {
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">MindWell Tokens</h1>
          <p className="text-muted-foreground">Earn tokens by completing activities and redeem them for sessions and premium features</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TokenBalance />
          </div>
          <div className="lg:col-span-2">
            <TokenHistory />
          </div>
        </div>
        
        <TokenRewards />
      </div>
    </DashboardLayout>
  );
}