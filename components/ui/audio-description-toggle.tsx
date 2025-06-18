'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { audioDescriptionService } from '@/lib/audio-description';
import { useAudioDescription } from '@/hooks/use-audio-description';

export function AudioDescriptionToggle() {
  const [settings, setSettings] = useState(audioDescriptionService.getSettings());
  const { elementRef } = useAudioDescription();

  useEffect(() => {
    setSettings(audioDescriptionService.getSettings());
  }, []);

  const toggleAudioDescription = () => {
    const newSettings = {
      ...settings,
      enabled: !settings.enabled,
    };
    
    audioDescriptionService.saveSettings(newSettings);
    setSettings(newSettings);
    
    if (newSettings.enabled) {
      audioDescriptionService.speak('Audio descriptions enabled. Hover over elements or use Tab to navigate for spoken descriptions.');
    } else {
      audioDescriptionService.stop();
    }
  };

  return (
    <Button
      ref={elementRef}
      variant="ghost"
      size="icon"
      onClick={toggleAudioDescription}
      className="hover:bg-white/10"
      aria-label={`${settings.enabled ? 'Disable' : 'Enable'} audio descriptions for accessibility`}
      title={`${settings.enabled ? 'Disable' : 'Enable'} audio descriptions`}
    >
      {settings.enabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </Button>
  );
}