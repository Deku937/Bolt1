'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MoodTracker } from '@/components/dashboard/patient/mood-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

export default function PatientMoodPage() {
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Mood Tracking</h1>
          <p className="text-muted-foreground">Monitor your emotional well-being and track progress over time</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MoodTracker />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Mood</span>
                    <span className="font-bold">7.2/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Best Day</span>
                    <span className="font-bold">Monday (8.5)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Entries This Week</span>
                    <span className="font-bold">6/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-healing" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>• Your mood has improved by 15% this month</p>
                  <p>• You're most positive on Mondays and Fridays</p>
                  <p>• Exercise days show 20% higher mood scores</p>
                  <p>• Consider scheduling therapy sessions on Wednesdays when mood tends to dip</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}