'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ProfessionalStats() {
  const weeklyData = [
    { day: 'Mon', sessions: 4, hours: 4 },
    { day: 'Tue', sessions: 6, hours: 6 },
    { day: 'Wed', sessions: 5, hours: 5 },
    { day: 'Thu', sessions: 8, hours: 7 },
    { day: 'Fri', sessions: 6, hours: 6 },
    { day: 'Sat', sessions: 3, hours: 3 },
    { day: 'Sun', sessions: 2, hours: 2 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Weekly Activity</CardTitle>
        <p className="text-xs md:text-sm text-muted-foreground">
          Your session and hour tracking for this week
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-48 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  fontSize: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Bar 
                dataKey="sessions" 
                fill="hsl(var(--primary))" 
                name="Sessions" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="hours" 
                fill="hsl(var(--healing))" 
                name="Hours" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}