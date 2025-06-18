'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Plus, Coins } from 'lucide-react';
import { tokenService, TOKEN_REWARDS } from '@/lib/tokens';
import { toast } from 'sonner';

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  score: number;
  note: string;
}

export function EnhancedMoodTracker() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: '1', date: 'Today', mood: '😊', score: 8, note: 'Feeling optimistic about therapy session' },
    { id: '2', date: 'Yesterday', mood: '😌', score: 7, note: 'Good meditation session' },
    { id: '3', date: '2 days ago', mood: '😐', score: 5, note: 'Neutral day, nothing special' },
    { id: '4', date: '3 days ago', mood: '😊', score: 8, note: 'Great workout and social time' },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedScore, setSelectedScore] = useState(5);
  const [note, setNote] = useState('');

  const moods = [
    { emoji: '😢', label: 'Very Sad', score: 1 },
    { emoji: '😔', label: 'Sad', score: 2 },
    { emoji: '😕', label: 'Down', score: 3 },
    { emoji: '😐', label: 'Neutral', score: 4 },
    { emoji: '🙂', label: 'Okay', score: 5 },
    { emoji: '😊', label: 'Good', score: 6 },
    { emoji: '😄', label: 'Happy', score: 7 },
    { emoji: '😁', label: 'Very Happy', score: 8 },
    { emoji: '🤩', label: 'Excellent', score: 9 },
    { emoji: '🥳', label: 'Amazing', score: 10 },
  ];

  const handleLogMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: 'Today',
      mood: selectedMood,
      score: selectedScore,
      note: note.trim(),
    };

    setMoodEntries(prev => [newEntry, ...prev.slice(0, 9)]);
    
    // Award tokens for mood logging
    tokenService.awardTokens(TOKEN_REWARDS.MOOD_LOG, 'Logged daily mood', 'mood');
    
    // Update mood streak (simplified - in real app would check actual dates)
    const currentStreak = tokenService.getUserTokens().streaks.mood + 1;
    tokenService.updateStreak('mood', currentStreak);
    
    toast.success(`🎉 Mood logged! You earned ${TOKEN_REWARDS.MOOD_LOG} tokens`);
    
    // Reset form
    setSelectedMood('');
    setSelectedScore(5);
    setNote('');
    setIsDialogOpen(false);
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-healing hover:bg-healing/90">
              <Plus className="w-4 h-4 mr-2" />
              Log Mood
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Your Mood</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">How are you feeling?</label>
                <div className="grid grid-cols-5 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.score}
                      onClick={() => {
                        setSelectedMood(mood.emoji);
                        setSelectedScore(mood.score);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedMood === mood.emoji 
                          ? 'border-healing bg-healing/10' 
                          : 'border-gray-200 hover:border-healing/50'
                      }`}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="text-xs mt-1">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Add a note (optional)</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-healing/10 rounded-lg">
                <span className="text-sm font-medium">Reward:</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-bold">+{TOKEN_REWARDS.MOOD_LOG} tokens</span>
                </div>
              </div>
              
              <Button onClick={handleLogMood} className="w-full" disabled={!selectedMood}>
                Log Mood & Earn Tokens
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
          {moodEntries.slice(0, 4).map((entry, index) => (
            <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg border">
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