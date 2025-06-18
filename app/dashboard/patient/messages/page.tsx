'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Search } from 'lucide-react';
import { useState } from 'react';

export default function PatientMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: '1',
      professional: {
        name: 'Dr. Sarah Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        specialty: 'Anxiety & Depression'
      },
      lastMessage: 'How are you feeling after our last session?',
      timestamp: '2 hours ago',
      unread: 2
    },
    {
      id: '2',
      professional: {
        name: 'Dr. Michael Rodriguez',
        avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
        specialty: 'Stress Management'
      },
      lastMessage: 'Great progress on your mindfulness exercises!',
      timestamp: '1 day ago',
      unread: 0
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'professional',
      content: 'Hello! How are you feeling today?',
      timestamp: '10:00 AM'
    },
    {
      id: '2',
      sender: 'user',
      content: 'Hi Dr. Chen, I\'m feeling much better after our last session. The breathing exercises really helped.',
      timestamp: '10:15 AM'
    },
    {
      id: '3',
      sender: 'professional',
      content: 'That\'s wonderful to hear! Keep practicing those techniques. How are you sleeping?',
      timestamp: '10:20 AM'
    },
    {
      id: '4',
      sender: 'user',
      content: 'Sleep has improved a lot. I\'m getting about 7-8 hours now.',
      timestamp: '10:25 AM'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  return (
    <DashboardLayout userType="patient">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate securely with your mental health professionals</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.professional.avatar} alt={conversation.professional.name} />
                        <AvatarFallback>{conversation.professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{conversation.professional.name}</h4>
                          <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{conversation.professional.specialty}</p>
                        <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversations[0].professional.avatar} alt={conversations[0].professional.name} />
                      <AvatarFallback>{conversations[0].professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{conversations[0].professional.name}</h3>
                      <p className="text-sm text-muted-foreground">{conversations[0].professional.specialty}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}