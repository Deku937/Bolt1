'use client';

import { useEffect, useRef } from 'react';
import { audioDescriptionService } from '@/lib/audio-description';

export function useAudioDescription() {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleFocus = () => {
      const settings = audioDescriptionService.getSettings();
      if (settings.enabled) {
        audioDescriptionService.describeElement(element);
      }
    };

    const handleMouseEnter = () => {
      const settings = audioDescriptionService.getSettings();
      if (settings.enabled && settings.autoDescribe) {
        audioDescriptionService.describeElement(element);
      }
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const describe = (customText?: string) => {
    if (elementRef.current) {
      audioDescriptionService.describeElement(elementRef.current, customText);
    }
  };

  return {
    elementRef,
    describe,
    speak: audioDescriptionService.speak.bind(audioDescriptionService),
    stop: audioDescriptionService.stop.bind(audioDescriptionService),
    isPlaying: audioDescriptionService.getIsPlaying(),
  };
}