'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Sparkles, Image, Camera, Palette, Zap, Download, Share2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
  imageGenerated?: boolean;
  isVoiceMessage?: boolean;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! 👋 I\'m your MindWell AI assistant with **lightning-fast** responses and **image generation** capabilities.\n\nI can help you with:\n🧠 Mental health questions\n📱 MindWell platform features\n🆘 Crisis resources\n💡 Wellness tips\n📸 Analyze images for mood insights\n🎨 **Generate therapeutic visuals** - Just ask me to create calming images!\n🖼️ **Create custom artwork** for meditation and relaxation\n\nTry saying: "Generate a peaceful forest scene" or "Create a calming ocean view" ✨',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string, imageUrl?: string, generateImage?: boolean, isVoiceMessage = false) => {
    if (!content.trim() && !imageUrl && !generateImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim() || (imageUrl ? 'I\'ve shared an image with you.' : generateImage ? 'Generate an image for me' : ''),
      role: 'user',
      timestamp: new Date(),
      imageUrl,
      isVoiceMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedImage(null);
    setIsLoading(true);

    if (generateImage) {
      setIsGeneratingImage(true);
    }

    try {
      const startTime = Date.now();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
            imageUrl: msg.imageUrl,
          })),
          imageUrl,
          generateImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Response failed');
      }

      const data = await response.json();
      
      // Ensure minimum response time for better UX
      const responseTime = Date.now() - startTime;
      const minResponseTime = generateImage ? 1500 : 800; // Longer for image generation
      
      if (responseTime < minResponseTime) {
        await new Promise(resolve => setTimeout(resolve, minResponseTime - responseTime));
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
        imageUrl: data.imageUrl,
        imageGenerated: data.imageGenerated,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Show success toast for image generation
      if (data.imageGenerated && data.imageUrl) {
        toast.success('🎨 Therapeutic image generated successfully!');
      }
      
      // Auto-play response if user sent a voice message OR if it's a crisis
      if (isVoiceMessage || data.message.includes('🚨') || data.message.includes('CRISIS')) {
        setTimeout(() => speakMessage(data.message), 500);
      }
      
    } catch (error) {
      console.error('Message send error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateImage 
          ? 'I apologize, but I\'m having trouble generating images right now. Please try again in a moment.\n\n🚨 **Emergency: 911**\n💙 **Crisis line: 988**\n📱 **MindWell:** Book sessions in "Find Professionals"'
          : 'I apologize for the delay. Here\'s quick help:\n\n🚨 **Emergency: 911**\n💙 **Crisis line: 988**\n📱 **MindWell:** Book sessions in "Find Professionals"\n\nPlease try again! ⚡',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      if (generateImage) {
        toast.error('Failed to generate image. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image too large. Please select an image under 10MB.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      toast.success('Image ready! Add a message and send.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = () => {
    if (!inputValue.trim()) {
      toast.error('Please describe what image you\'d like me to create.');
      return;
    }
    sendMessage(inputValue, undefined, true);
  };

  const handleQuickImageGeneration = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => {
      sendMessage(prompt, undefined, true);
    }, 100);
  };

  const downloadImage = async (imageUrl: string, imageName: string = 'mindwell-image') => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const shareImage = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MindWell Therapeutic Image',
          text: 'Check out this calming image generated by MindWell AI',
          url: imageUrl,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(imageUrl);
        toast.success('Image URL copied to clipboard!');
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(imageUrl);
      toast.success('Image URL copied to clipboard!');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        await transcribeAudio(audioBlob);
        setAudioChunks([]);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.success('🎤 Recording... Speak now!');
    } catch (error) {
      console.error('Recording start error:', error);
      toast.error('Cannot access microphone. Check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      toast.success('⏹️ Processing...');
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Audio transcription failed');
      }

      const data = await response.json();
      if (data.text) {
        await sendMessage(data.text, undefined, false, true);
        if (data.fallback) {
          toast.info('📝 Demo transcription - Response will be spoken');
        } else {
          toast.success('✅ Transcribed and sent! Response will be spoken');
        }
      }
    } catch (error) {
      console.error('Audio transcription error:', error);
      toast.error('❌ Transcription error. Please try again.');
    }
  };

  const speakMessage = async (text: string) => {
    if (isSpeaking) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.audioData && !data.useWebSpeech) {
        const audio = new Audio(data.audioData);
        currentAudioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
        };
        
        audio.onerror = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          fallbackToWebSpeech(text);
        };
        
        await audio.play();
        toast.success('🔊 Playing audio response');
        
      } else {
        fallbackToWebSpeech(text);
      }
      
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsSpeaking(false);
      fallbackToWebSpeech(text);
    }
  };

  const fallbackToWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.1;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('❌ Audio playback error');
      };
      
      window.speechSynthesis.speak(utterance);
      toast.info('🔊 Browser speech response');
    } else {
      setIsSpeaking(false);
      toast.error('❌ Speech synthesis not supported');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue, selectedImage || undefined);
  };

  const quickQuestions = [
    "How to manage anxiety?",
    "Depression symptoms",
    "Book a session",
    "Mood tracking",
    "Relaxation techniques",
    "Crisis resources"
  ];

  const quickImagePrompts = [
    "Generate a peaceful forest scene",
    "Create a calming ocean view",
    "Make a serene mountain landscape",
    "Generate a cozy meditation space",
    "Create a beautiful sunset scene",
    "Make a tranquil garden image"
  ];

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-[9999] w-14 h-14 rounded-full shadow-xl transition-all duration-300",
          "bg-gradient-to-r from-primary to-healing hover:shadow-2xl hover:scale-110",
          "border-2 border-white/20",
          isOpen && "rotate-180"
        )}
        size="icon"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
            <Zap className="w-1.5 h-1.5 text-white" />
          </div>
        )}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className={cn(
          "fixed z-[9998] shadow-2xl border-0 glass-effect animate-in slide-in-from-bottom-5 duration-300",
          "bottom-20 left-2 right-2 top-4",
          "md:bottom-20 md:right-4 md:left-auto md:top-auto md:w-96 md:h-[600px]"
        )}>
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-healing/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-healing rounded-full flex items-center justify-center relative">
                <Bot className="w-4 h-4 text-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold flex items-center gap-2">
                  <span className="truncate">MindWell AI</span>
                  <Palette className="w-4 h-4 text-healing flex-shrink-0 animate-pulse" />
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  ⚡ Fast • 🎨 Image Generation • 🗣️ Voice • 👁️ Vision
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(100%-80px)] md:h-[calc(100%-100px)]">
            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="p-3 border-b bg-muted/30">
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-primary" />
                  Quick actions:
                </p>
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-2 hover:bg-primary/10 justify-start"
                      onClick={() => sendMessage(question)}
                    >
                      <span className="truncate">{question}</span>
                    </Button>
                  ))}
                </div>
                
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-healing" />
                  Generate images:
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {quickImagePrompts.slice(0, 3).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-2 hover:bg-healing/10 justify-start"
                      onClick={() => handleQuickImageGeneration(prompt)}
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      <span className="truncate">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 animate-in slide-in-from-bottom-2 duration-300",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-7 h-7 bg-gradient-to-r from-primary to-healing rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-sm relative",
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      )}
                    >
                      {/* Voice message indicator */}
                      {message.isVoiceMessage && (
                        <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
                          <Mic className="w-3 h-3" />
                          <span>Voice message</span>
                        </div>
                      )}
                      
                      {/* Image display with enhanced controls */}
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img 
                            src={message.imageUrl} 
                            alt={message.imageGenerated ? "Generated therapeutic image" : "Uploaded image"}
                            className="max-w-full h-auto rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ maxHeight: '200px' }}
                            onClick={() => window.open(message.imageUrl, '_blank')}
                          />
                          
                          {/* Image controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-xs opacity-70">
                              {message.imageGenerated ? (
                                <>
                                  <Palette className="w-3 h-3" />
                                  <span>AI Generated</span>
                                </>
                              ) : (
                                <>
                                  <Camera className="w-3 h-3" />
                                  <span>Uploaded</span>
                                </>
                              )}
                            </div>
                            
                            {message.imageGenerated && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs hover:bg-primary/10"
                                  onClick={() => downloadImage(message.imageUrl!, 'therapeutic-image')}
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs hover:bg-primary/10"
                                  onClick={() => shareImage(message.imageUrl!)}
                                >
                                  <Share2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className="text-xs opacity-70 flex-shrink-0">
                          {message.timestamp.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs hover:bg-primary/10 flex-shrink-0"
                            onClick={() => speakMessage(message.content)}
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3 h-3 mr-1" />
                            ) : (
                              <Volume2 className="w-3 h-3 mr-1" />
                            )}
                            <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator with image generation status */}
                {isLoading && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="w-7 h-7 bg-gradient-to-r from-primary to-healing rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm ml-2">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="text-xs ml-2 text-muted-foreground flex items-center gap-1">
                          {isGeneratingImage ? (
                            <>
                              <Palette className="w-3 h-3 animate-pulse" />
                              Generating image...
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 animate-pulse" />
                              Thinking fast...
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Image Preview */}
            {selectedImage && (
              <div className="p-3 border-t bg-muted/30">
                <div className="flex items-center gap-2">
                  <img 
                    src={selectedImage} 
                    alt="Selected image" 
                    className="w-10 h-10 object-cover rounded border"
                  />
                  <span className="text-sm text-muted-foreground flex-1 truncate">Image ready to send</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Enhanced Input */}
            <div className="p-3 border-t bg-background/50">
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex gap-1">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything or describe an image to generate..."
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || (!inputValue.trim() && !selectedImage)}
                    className="bg-gradient-to-r from-primary to-healing hover:shadow-lg transition-all duration-300 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="flex gap-1">
                  {/* Image Upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload image for analysis"
                    className="flex-1"
                  >
                    <Image className="w-4 h-4 mr-1" />
                    <span className="text-xs">Upload</span>
                  </Button>

                  {/* Image Generation */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateImage}
                    disabled={!inputValue.trim() || isLoading}
                    title="Generate therapeutic image"
                    className="flex-1 bg-healing/5 hover:bg-healing/10 border-healing/30"
                  >
                    <Palette className="w-4 h-4 mr-1" />
                    <span className="text-xs">Generate</span>
                  </Button>
                  
                  {/* Voice Recording */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                      "transition-all duration-300 flex-1",
                      isRecording && "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                    )}
                    title={isRecording ? "Stop recording" : "Voice recording"}
                  >
                    {isRecording ? <MicOff className="w-4 h-4 mr-1" /> : <Mic className="w-4 h-4 mr-1" />}
                    <span className="text-xs">{isRecording ? 'Stop' : 'Voice'}</span>
                  </Button>
                </div>
              </form>
              
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 animate-pulse text-healing" />
                  AI-powered mental health support with image generation
                  <Sparkles className="w-3 h-3 animate-pulse text-primary" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}