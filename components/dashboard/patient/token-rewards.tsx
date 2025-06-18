'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Coins, Video, Star, Clock, BookOpen, Users, Gift, Check } from 'lucide-react';
import { tokenService, UserTokens, AVAILABLE_REWARDS, TokenReward } from '@/lib/tokens';
import { toast } from 'sonner';

export function TokenRewards() {
  const [tokens, setTokens] = useState<UserTokens | null>(null);
  const [selectedReward, setSelectedReward] = useState<TokenReward | null>(null);

  useEffect(() => {
    setTokens(tokenService.getUserTokens());
  }, []);

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video': return <Video className="w-6 h-6" />;
      case 'Star': return <Star className="w-6 h-6" />;
      case 'Clock': return <Clock className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      default: return <Gift className="w-6 h-6" />;
    }
  };

  const handleRedeemReward = (reward: TokenReward) => {
    if (!tokens || tokens.balance < reward.cost) {
      toast.error('Insufficient tokens to redeem this reward');
      return;
    }

    const newTokens = tokenService.spendTokens(reward.cost, `Redeemed: ${reward.name}`, 'reward');
    if (newTokens) {
      setTokens(newTokens);
      toast.success(`🎉 Successfully redeemed ${reward.name}!`);
      setSelectedReward(null);
    }
  };

  if (!tokens) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-warm" />
          Token Rewards
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Redeem your tokens for sessions, features, and premium content
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_REWARDS.map((reward) => (
            <div key={reward.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      reward.type === 'session' ? 'bg-primary/10 text-primary' :
                      reward.type === 'feature' ? 'bg-healing/10 text-healing' :
                      'bg-warm/10 text-warm'
                    }`}>
                      {getRewardIcon(reward.icon)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{reward.name}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {reward.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="font-bold">{reward.cost}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{reward.description}</p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="w-full"
                      variant={tokens.balance >= reward.cost ? "default" : "outline"}
                      disabled={!reward.available || tokens.balance < reward.cost}
                      onClick={() => setSelectedReward(reward)}
                    >
                      {tokens.balance >= reward.cost ? (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Redeem
                        </>
                      ) : (
                        `Need ${reward.cost - tokens.balance} more tokens`
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Redeem Reward</DialogTitle>
                    </DialogHeader>
                    {selectedReward && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <div className={`p-3 rounded-lg ${
                            selectedReward.type === 'session' ? 'bg-primary/10 text-primary' :
                            selectedReward.type === 'feature' ? 'bg-healing/10 text-healing' :
                            'bg-warm/10 text-warm'
                          }`}>
                            {getRewardIcon(selectedReward.icon)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{selectedReward.name}</h4>
                            <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Cost:</span>
                            <div className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-primary" />
                              <span className="font-bold">{selectedReward.cost}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Your balance:</span>
                            <div className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-primary" />
                              <span className="font-bold">{tokens.balance}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center font-semibold">
                            <span>After redemption:</span>
                            <div className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-primary" />
                              <span>{tokens.balance - selectedReward.cost}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleRedeemReward(selectedReward)} 
                          className="w-full"
                          disabled={tokens.balance < selectedReward.cost}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Confirm Redemption
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}