'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Plus } from 'lucide-react';

export function MoodTracker() {
  const recentMoods = [
    { date: 'Today', mood: '😊', score: 8, note: 'Feeling optimistic about therapy session' },
    { date: 'Yesterday', mood: '😌', score: 7, note: 'Good meditation session' },
    { date: '2 days ago', mood: '😐', score: 5, note: 'Neutral day, nothing special' },
    { date: '3 days ago', mood: '😊', score: 8, note: 'Great workout and social time' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-healing" />
            Mood Tracker
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Track your daily emotional well-being</p>
        </div>
        <Button size="sm" className="bg-healing hover:bg-healing/90">
          <Plus className="w-4 h-4 mr-2" />
          Log Mood
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-healing/10 to-primary/10 rounded-lg">
          <div>
            <p className="text-sm font-medium">7-day average</p>
            <p className="text-2xl font-bold">7.2/10</p>
          </div>
          <Badge variant="secondary" className="bg-healing/20 text-healing">
            Improving ↗
          </Badge>
        </div>

        <div className="space-y-3">
          {recentMoods.map((entry, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
              <span className="text-2xl">{entry.mood}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{entry.date}</span>
                  <Badge variant="outline">{entry.score}/10</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{entry.note}</p>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full">
          View Full History
        </Button>
      </CardContent>
    </Card>
  );
}