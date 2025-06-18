'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Gift, Star } from 'lucide-react';
import { tokenService, UserTokens } from '@/lib/tokens';
import { toast } from 'sonner';

export function TokenBalance() {
  const [tokens, setTokens] = useState<UserTokens | null>(null);
  const router = useRouter();

  useEffect(() => {
    setTokens(tokenService.getUserTokens());
  }, []);

  const handleQuickEarn = () => {
    const newTokens = tokenService.awardTokens(10, 'Daily check-in bonus!', 'milestone');
    setTokens(newTokens);
    toast.success('🎉 You earned 10 tokens for checking in today!');
  };

  const handleRewardsClick = () => {
    router.push('/dashboard/patient/tokens');
  };

  if (!tokens) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-healing/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Coins className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          MindWell Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl md:text-2xl font-bold text-primary">{tokens.balance}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Available tokens</p>
          </div>
          <div className="text-right">
            <p className="text-base md:text-lg font-semibold">{tokens.totalEarned}</p>
            <p className="text-xs text-muted-foreground">Total earned</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-healing" />
              <span className="text-xs font-medium">{tokens.streaks.mood}</span>
            </div>
            <p className="text-xs text-muted-foreground">Mood streak</p>
          </div>
          <div className="p-2 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-warm" />
              <span className="text-xs font-medium">{tokens.streaks.sessions}</span>
            </div>
            <p className="text-xs text-muted-foreground">Session streak</p>
          </div>
          <div className="p-2 bg-white/50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Gift className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium">{tokens.streaks.resources}</span>
            </div>
            <p className="text-xs text-muted-foreground">Resource streak</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleQuickEarn} className="flex-1 text-xs md:text-sm">
            <Coins className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Daily Bonus
          </Button>
          <Button size="sm" className="flex-1 bg-healing hover:bg-healing/90 text-xs md:text-sm" onClick={handleRewardsClick}>
            <Gift className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Rewards
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}