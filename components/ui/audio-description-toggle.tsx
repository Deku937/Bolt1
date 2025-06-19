'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Volume2, VolumeX, Settings, Play, Square, MessageSquare, Headphones } from 'lucide-react';
import { audioDescriptionService } from '@/lib/audio-description';
import { toast } from 'sonner';

export function AudioDescriptionToggle() {
  const [settings, setSettings] = useState(audioDescriptionService.getDefaultSettings());
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Array<{id: string, name: string, category: string}>>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Load current settings
    const currentSettings = audioDescriptionService.getSettings();
    setSettings(currentSettings);
    
    // Load available voices
    loadVoices();
    
    // Check playing state periodically
    const interval = setInterval(() => {
      setIsPlaying(audioDescriptionService.getIsPlaying());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadVoices = async () => {
    try {
      const voices = await audioDescriptionService.getAvailableVoices();
      setAvailableVoices(voices);
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  };

  const handleToggle = () => {
    const newSettings = { 
      ...settings, 
      enabled: !settings.enabled,
      language: 'en' // Force English
    };
    setSettings(newSettings);
    audioDescriptionService.saveSettings(newSettings);
    
    // Show toast in English
    if (newSettings.enabled) {
      toast.success('Audio description enabled');
      // Test the audio description
      setTimeout(() => {
        audioDescriptionService.speak('Audio description is now active. Navigate with Tab key to hear element descriptions.');
      }, 500);
    } else {
      toast.info('Audio description disabled');
      audioDescriptionService.stop();
    }
  };

  const handleStop = () => {
    audioDescriptionService.stop();
    setIsPlaying(false);
  };

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { 
      ...settings, 
      [key]: value,
      language: 'en' // Always force English
    };
    setSettings(newSettings);
    audioDescriptionService.saveSettings(newSettings);
  };

  const handleTestVoice = async () => {
    try {
      await audioDescriptionService.speak('This is a test of the audio description voice. The voice is now speaking in English.');
    } catch (error) {
      console.error('Error testing voice:', error);
      toast.error('Error testing voice');
    }
  };

  const handleDescribePage = async () => {
    try {
      await audioDescriptionService.describePageContent();
    } catch (error) {
      console.error('Error describing page:', error);
      toast.error('Error describing page');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Main toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={`relative transition-all duration-200 ${
          settings.enabled 
            ? 'text-primary hover:text-primary/80 bg-primary/10' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label={settings.enabled ? 'Disable audio description' : 'Enable audio description'}
        title={settings.enabled ? 'Audio description enabled - Click to disable' : 'Audio description disabled - Click to enable'}
      >
        {settings.enabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
        
        {/* Status indicator */}
        {settings.enabled && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </Button>

      {/* Stop button when playing */}
      {isPlaying && settings.enabled && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStop}
          className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
          aria-label="Stop audio description"
          title="Stop current audio description"
        >
          <Square className="w-4 h-4" />
        </Button>
      )}

      {/* Settings dialog */}
      {settings.enabled && (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Audio description settings"
              title="Configure audio description settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-primary" />
                Audio Description Settings
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <Label>Status</Label>
                <Badge variant={settings.enabled ? "default" : "secondary"}>
                  {settings.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <Separator />

              {/* Voice Selection */}
              <div className="space-y-2">
                <Label>Voice</Label>
                <Select 
                  value={settings.voice} 
                  onValueChange={(value) => handleSettingChange('voice', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name} ({voice.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Speech Speed</Label>
                  <span className="text-sm text-muted-foreground">{settings.speed}x</span>
                </div>
                <Slider
                  value={[settings.speed]}
                  onValueChange={([value]) => handleSettingChange('speed', value)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Auto-describe toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-describe on hover</Label>
                  <p className="text-xs text-muted-foreground">Automatically describe elements when hovering</p>
                </div>
                <Switch
                  checked={settings.autoDescribe}
                  onCheckedChange={(checked) => handleSettingChange('autoDescribe', checked)}
                />
              </div>

              <Separator />

              {/* Test buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestVoice}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Test Voice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDescribePage}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Describe Page
                </Button>
              </div>

              {/* Instructions */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">How to use:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Navigate with Tab key to hear descriptions</li>
                    <li>• Hover over elements for auto-description</li>
                    <li>• Press Escape to stop current audio</li>
                    <li>• Use settings to customize voice and speed</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}