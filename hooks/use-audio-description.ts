'use client';

import { useEffect, useRef, useState } from 'react';
import { audioDescriptionService } from '@/lib/audio-description';

interface UseAudioDescriptionOptions {
  customDescription?: string;
  autoDescribe?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export function useAudioDescription(options: UseAudioDescriptionOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Vérifier si l'audio description est activée
    const settings = audioDescriptionService.getSettings();
    setIsEnabled(settings.enabled);

    // Écouter les changements d'état
    const checkState = () => {
      const currentSettings = audioDescriptionService.getSettings();
      setIsEnabled(currentSettings.enabled);
      setIsPlaying(audioDescriptionService.getIsPlaying());
    };

    const interval = setInterval(checkState, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isEnabled) return;

    const handleFocus = () => {
      if (options.autoDescribe !== false) {
        describe();
      }
    };

    const handleMouseEnter = () => {
      const settings = audioDescriptionService.getSettings();
      if (settings.autoDescribe && options.autoDescribe !== false) {
        describe();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Arrêter la lecture avec Échap
      if (event.key === 'Escape') {
        stop();
      }
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEnabled, options.autoDescribe, options.customDescription]);

  const describe = async (customText?: string) => {
    if (!elementRef.current || !isEnabled) return;

    const textToSpeak = customText || options.customDescription;
    
    try {
      await audioDescriptionService.describeElement(elementRef.current, textToSpeak);
    } catch (error) {
      console.error('Erreur lors de la description audio:', error);
    }
  };

  const speak = async (text: string) => {
    if (!isEnabled) return;
    
    try {
      await audioDescriptionService.speak(text);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    }
  };

  const stop = () => {
    audioDescriptionService.stop();
  };

  const describeNavigation = async () => {
    if (!isEnabled) return;
    
    try {
      await audioDescriptionService.describeNavigation();
    } catch (error) {
      console.error('Erreur lors de la description de navigation:', error);
    }
  };

  const describePageContent = async () => {
    if (!isEnabled) return;
    
    try {
      await audioDescriptionService.describePageContent();
    } catch (error) {
      console.error('Erreur lors de la description de page:', error);
    }
  };

  return {
    elementRef,
    describe,
    speak,
    stop,
    describeNavigation,
    describePageContent,
    isPlaying,
    isEnabled,
  };
}

// Hook spécialisé pour les boutons
export function useButtonAudioDescription(label: string, description?: string) {
  return useAudioDescription({
    customDescription: description || `Bouton: ${label}`,
    autoDescribe: true,
    priority: 'normal',
  });
}

// Hook spécialisé pour les liens
export function useLinkAudioDescription(text: string, href?: string) {
  const linkDescription = href 
    ? `Lien vers ${href}: ${text}`
    : `Lien: ${text}`;
    
  return useAudioDescription({
    customDescription: linkDescription,
    autoDescribe: true,
    priority: 'normal',
  });
}

// Hook spécialisé pour les formulaires
export function useFormAudioDescription(label: string, type: string = 'input', required: boolean = false) {
  const formDescription = `${type === 'input' ? 'Champ de saisie' : type} ${label}${required ? ', requis' : ''}`;
  
  return useAudioDescription({
    customDescription: formDescription,
    autoDescribe: true,
    priority: 'high',
  });
}

// Hook spécialisé pour les titres
export function useHeadingAudioDescription(level: number, text: string) {
  return useAudioDescription({
    customDescription: `Titre de niveau ${level}: ${text}`,
    autoDescribe: true,
    priority: 'high',
  });
}