// Token earning system for patient rewards
export interface TokenTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  timestamp: Date;
  category: 'session' | 'mood' | 'resource' | 'streak' | 'milestone' | 'reward';
}

export interface TokenReward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'session' | 'feature' | 'content';
  icon: string;
  available: boolean;
}

export interface UserTokens {
  balance: number;
  totalEarned: number;
  transactions: TokenTransaction[];
  streaks: {
    mood: number;
    sessions: number;
    resources: number;
  };
}

// Token earning rules
export const TOKEN_REWARDS = {
  MOOD_LOG: 10,
  SESSION_COMPLETE: 50,
  RESOURCE_READ: 15,
  RESOURCE_COMPLETE: 25,
  DAILY_STREAK_3: 30,
  DAILY_STREAK_7: 75,
  DAILY_STREAK_30: 200,
  FIRST_SESSION: 100,
  MILESTONE_5_SESSIONS: 150,
  MILESTONE_10_SESSIONS: 300,
  MILESTONE_20_SESSIONS: 500,
} as const;

// Available rewards
export const AVAILABLE_REWARDS: TokenReward[] = [
  {
    id: 'free-session',
    name: 'Free Therapy Session',
    description: 'Book a 50-minute session with any professional',
    cost: 500,
    type: 'session',
    icon: 'Video',
    available: true,
  },
  {
    id: 'priority-booking',
    name: 'Priority Booking',
    description: 'Get priority access to book sessions with popular professionals',
    cost: 200,
    type: 'feature',
    icon: 'Star',
    available: true,
  },
  {
    id: 'extended-session',
    name: 'Extended Session (75 min)',
    description: 'Book a longer 75-minute session',
    cost: 300,
    type: 'session',
    icon: 'Clock',
    available: true,
  },
  {
    id: 'premium-content',
    name: 'Premium Content Access',
    description: 'Unlock premium guided meditations and resources for 30 days',
    cost: 150,
    type: 'content',
    icon: 'BookOpen',
    available: true,
  },
  {
    id: 'group-session',
    name: 'Group Therapy Session',
    description: 'Join a group therapy session on topics of your choice',
    cost: 250,
    type: 'session',
    icon: 'Users',
    available: true,
  },
];

class TokenService {
  private storageKey = 'mindwell_tokens';

  // Get user's token data
  getUserTokens(): UserTokens {
    if (typeof window === 'undefined') {
      return this.getDefaultTokens();
    }
    
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultTokens();
    } catch {
      return this.getDefaultTokens();
    }
  }

  // Save token data
  private saveTokens(tokens: UserTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(tokens));
    }
  }

  // Default token structure
  private getDefaultTokens(): UserTokens {
    return {
      balance: 100, // Starting bonus
      totalEarned: 100,
      transactions: [
        {
          id: '1',
          type: 'earned',
          amount: 100,
          reason: 'Welcome bonus for joining MindWell!',
          timestamp: new Date(),
          category: 'milestone',
        },
      ],
      streaks: {
        mood: 0,
        sessions: 0,
        resources: 0,
      },
    };
  }

  // Award tokens for completing tasks
  awardTokens(
    amount: number,
    reason: string,
    category: TokenTransaction['category']
  ): UserTokens {
    const tokens = this.getUserTokens();
    
    const transaction: TokenTransaction = {
      id: Date.now().toString(),
      type: 'earned',
      amount,
      reason,
      timestamp: new Date(),
      category,
    };

    tokens.balance += amount;
    tokens.totalEarned += amount;
    tokens.transactions.unshift(transaction);

    this.saveTokens(tokens);
    return tokens;
  }

  // Spend tokens on rewards
  spendTokens(amount: number, reason: string, category: TokenTransaction['category']): UserTokens | null {
    const tokens = this.getUserTokens();
    
    if (tokens.balance < amount) {
      return null; // Insufficient balance
    }

    const transaction: TokenTransaction = {
      id: Date.now().toString(),
      type: 'spent',
      amount,
      reason,
      timestamp: new Date(),
      category,
    };

    tokens.balance -= amount;
    tokens.transactions.unshift(transaction);

    this.saveTokens(tokens);
    return tokens;
  }

  // Update streaks
  updateStreak(type: keyof UserTokens['streaks'], count: number): UserTokens {
    const tokens = this.getUserTokens();
    tokens.streaks[type] = count;
    
    // Award streak bonuses
    if (type === 'mood') {
      if (count === 3) {
        this.awardTokens(TOKEN_REWARDS.DAILY_STREAK_3, '3-day mood tracking streak!', 'streak');
      } else if (count === 7) {
        this.awardTokens(TOKEN_REWARDS.DAILY_STREAK_7, '7-day mood tracking streak!', 'streak');
      } else if (count === 30) {
        this.awardTokens(TOKEN_REWARDS.DAILY_STREAK_30, '30-day mood tracking streak!', 'streak');
      }
    }

    this.saveTokens(tokens);
    return tokens;
  }

  // Get recent transactions
  getRecentTransactions(limit: number = 10): TokenTransaction[] {
    const tokens = this.getUserTokens();
    return tokens.transactions.slice(0, limit);
  }
}

export const tokenService = new TokenService();