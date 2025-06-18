// Audio description service using ElevenLabs API
export interface AudioDescriptionSettings {
  enabled: boolean;
  voice: string;
  speed: number;
  autoDescribe: boolean;
}

class AudioDescriptionService {
  private storageKey = 'mindwell_audio_description';
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;

  // Get user's audio description settings
  getSettings(): AudioDescriptionSettings {
    if (typeof window === 'undefined') {
      return this.getDefaultSettings();
    }
    
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? { ...this.getDefaultSettings(), ...JSON.parse(data) } : this.getDefaultSettings();
    } catch {
      return this.getDefaultSettings();
    }
  }

  // Save audio description settings
  saveSettings(settings: AudioDescriptionSettings): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }
  }

  // Default settings
  private getDefaultSettings(): AudioDescriptionSettings {
    return {
      enabled: false,
      voice: 'EXAVITQu4vr4xnSDxMaL', // Bella voice
      speed: 1.0,
      autoDescribe: false,
    };
  }

  // Generate audio description for UI elements
  async describeElement(element: HTMLElement, customText?: string): Promise<void> {
    const settings = this.getSettings();
    if (!settings.enabled) return;

    let description = customText;
    
    if (!description) {
      description = this.generateElementDescription(element);
    }

    if (description) {
      await this.speak(description);
    }
  }

  // Generate description text for an element
  private generateElementDescription(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const title = element.getAttribute('title');
    const textContent = element.textContent?.trim();

    // Use aria-label or title if available
    if (ariaLabel) return ariaLabel;
    if (title) return title;

    // Generate description based on element type
    switch (tagName) {
      case 'button':
        return `Button: ${textContent || 'unlabeled button'}`;
      case 'input':
        const inputType = element.getAttribute('type') || 'text';
        const placeholder = element.getAttribute('placeholder');
        return `${inputType} input${placeholder ? `: ${placeholder}` : ''}`;
      case 'a':
        return `Link: ${textContent || 'unlabeled link'}`;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return `Heading level ${tagName.charAt(1)}: ${textContent}`;
      case 'img':
        const alt = element.getAttribute('alt');
        return `Image: ${alt || 'no description available'}`;
      case 'nav':
        return 'Navigation menu';
      case 'main':
        return 'Main content area';
      case 'aside':
        return 'Sidebar content';
      case 'footer':
        return 'Footer content';
      case 'header':
        return 'Header content';
      default:
        if (role) {
          return `${role}: ${textContent || 'interactive element'}`;
        }
        return textContent || 'Interactive element';
    }
  }

  // Speak text using ElevenLabs or fallback to Web Speech API
  async speak(text: string): Promise<void> {
    if (this.isPlaying) {
      this.stop();
    }

    const settings = this.getSettings();
    if (!settings.enabled) return;

    try {
      this.isPlaying = true;
      
      // Try ElevenLabs first
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          voice: settings.voice,
          speed: settings.speed 
        }),
      });

      const data = await response.json();

      if (data.audioData && !data.useWebSpeech) {
        // Use ElevenLabs audio
        const audio = new Audio(data.audioData);
        this.currentAudio = audio;
        
        audio.onended = () => {
          this.isPlaying = false;
          this.currentAudio = null;
        };
        
        audio.onerror = () => {
          this.isPlaying = false;
          this.currentAudio = null;
          // Fallback to Web Speech API
          this.fallbackToWebSpeech(text, settings);
        };
        
        await audio.play();
      } else {
        // Fallback to Web Speech API
        this.fallbackToWebSpeech(text, settings);
      }
      
    } catch (error) {
      console.error('Audio description error:', error);
      this.isPlaying = false;
      this.fallbackToWebSpeech(text, settings);
    }
  }

  // Fallback to Web Speech API
  private fallbackToWebSpeech(text: string, settings: AudioDescriptionSettings): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = settings.speed;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        this.isPlaying = true;
      };
      
      utterance.onend = () => {
        this.isPlaying = false;
      };
      
      utterance.onerror = () => {
        this.isPlaying = false;
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      this.isPlaying = false;
    }
  }

  // Stop current audio
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    this.isPlaying = false;
  }

  // Check if currently playing
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Describe page content automatically
  async describePageContent(): Promise<void> {
    const settings = this.getSettings();
    if (!settings.enabled || !settings.autoDescribe) return;

    // Get main content areas
    const main = document.querySelector('main');
    const headings = document.querySelectorAll('h1, h2, h3');
    
    let description = 'Page loaded. ';
    
    // Describe main heading
    const mainHeading = headings[0];
    if (mainHeading) {
      description += `Main heading: ${mainHeading.textContent}. `;
    }
    
    // Count interactive elements
    const buttons = document.querySelectorAll('button').length;
    const links = document.querySelectorAll('a').length;
    const inputs = document.querySelectorAll('input, select, textarea').length;
    
    if (buttons > 0) description += `${buttons} buttons available. `;
    if (links > 0) description += `${links} links available. `;
    if (inputs > 0) description += `${inputs} form controls available. `;
    
    description += 'Use Tab to navigate, Enter to activate, or enable auto-describe for detailed navigation.';
    
    await this.speak(description);
  }

  // Describe navigation structure
  async describeNavigation(): Promise<void> {
    const settings = this.getSettings();
    if (!settings.enabled) return;

    const navElements = document.querySelectorAll('nav');
    let description = '';
    
    if (navElements.length === 0) {
      description = 'No navigation menus found on this page.';
    } else {
      description = `${navElements.length} navigation menu${navElements.length > 1 ? 's' : ''} available. `;
      
      navElements.forEach((nav, index) => {
        const links = nav.querySelectorAll('a, button');
        description += `Menu ${index + 1} has ${links.length} items. `;
      });
    }
    
    await this.speak(description);
  }
}

export const audioDescriptionService = new AudioDescriptionService();