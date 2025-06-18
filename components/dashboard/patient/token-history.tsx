'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Coins, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { tokenService, TokenTransaction } from '@/lib/tokens';

export function TokenHistory() {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);

  useEffect(() => {
    setTransactions(tokenService.getRecentTransactions(20));
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'session': return 'bg-primary/10 text-primary';
      case 'mood': return 'bg-healing/10 text-healing';
      case 'resource': return 'bg-warm/10 text-warm';
      case 'streak': return 'bg-purple-100 text-purple-700';
      case 'milestone': return 'bg-blue-100 text-blue-700';
      case 'reward': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Token History
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your recent token earnings and spending
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'earned' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {transaction.type === 'earned' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium">{transaction.reason}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.timestamp)}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`flex items-center gap-1 font-bold ${
                    transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>{transaction.type === 'earned' ? '+' : '-'}</span>
                    <Coins className="w-4 h-4" />
                    <span>{transaction.amount}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <Coins className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No token transactions yet</p>
                <p className="text-sm text-muted-foreground">Complete tasks to start earning tokens!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}