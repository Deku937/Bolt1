'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Search, BookOpen, MessageCircle, AlertCircle, Plus } from 'lucide-react';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <Button variant="outline" className="flex flex-col gap-2 h-auto py-3 md:py-4 hover:bg-primary/5 text-xs md:text-sm">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <span>Book Session</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col gap-2 h-auto py-3 md:py-4 hover:bg-healing/5 text-xs md:text-sm">
            <Search className="w-5 h-5 md:w-6 md:h-6 text-healing" />
            <span>Find Professional</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col gap-2 h-auto py-3 md:py-4 hover:bg-warm/5 text-xs md:text-sm">
            <Plus className="w-5 h-5 md:w-6 md:h-6 text-warm" />
            <span>Log Mood</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col gap-2 h-auto py-3 md:py-4 hover:bg-primary/5 text-xs md:text-sm">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <span>Resources</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col gap-2 h-auto py-3 md:py-4 hover:bg-healing/5 text-xs md:text-sm">
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-healing" />
            <span>Messages</span>
          </Button>
          
          <Button variant="destructive" className="flex flex-col gap-2 h-auto py-3 md:py-4 text-xs md:text-sm">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
            <span>Crisis Help</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}