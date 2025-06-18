'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Clock, Star } from 'lucide-react';

export function RecommendedContent() {
  const recommendations = [
    {
      type: 'article',
      title: 'Managing Anxiety: 5 Proven Techniques',
      description: 'Learn practical strategies to reduce anxiety in your daily life',
      duration: '8 min read',
      rating: 4.8,
      category: 'Anxiety'
    },
    {
      type: 'meditation',
      title: 'Guided Relaxation for Better Sleep',
      description: 'A calming meditation to help you unwind before bedtime',
      duration: '15 min',
      rating: 4.9,
      category: 'Sleep'
    },
    {
      type: 'video',
      title: 'Understanding Depression: A Professional Perspective',
      description: 'Dr. Sarah Chen explains the fundamentals of depression',
      duration: '12 min',
      rating: 4.7,
      category: 'Depression'
    },
    {
      type: 'exercise',
      title: 'Daily Mindfulness Practice',
      description: 'Simple exercises to increase mindfulness throughout your day',
      duration: '5 min',
      rating: 4.6,
      category: 'Mindfulness'
    }
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'meditation': return <Clock className="w-4 h-4" />;
      case 'exercise': return <Star className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-warm" />
          Recommended for You
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized content based on your interests and progress
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((item, index) => (
            <div key={index} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {item.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {item.rating}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold line-clamp-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {getContentIcon(item.type)}
                      {item.duration}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    {item.type === 'video' ? 'Watch' : item.type === 'meditation' ? 'Listen' : 'Read'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline">
            Browse All Resources
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}