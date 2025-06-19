// Audio description service using ElevenLabs API
export interface AudioDescriptionSettings {
  enabled: boolean;
  voice: string;
  speed: number;
  autoDescribe: boolean;
  language: string;
  stability: number;
  similarityBoost: number;
}

class AudioDescriptionService {
  private storageKey = 'mindwell_audio_description';
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private abortController: AbortController | null = null;

  // Get user's audio description settings
  getSettings(): AudioDescriptionSettings {
    if (typeof window === 'undefined') {
      return this.getDefaultSettings();
    }
    
    try {
      const data = localStorage.getItem(this.storageKey);
      const settings = data ? { ...this.getDefaultSettings(), ...JSON.parse(data) } : this.getDefaultSettings();
      // Force English language
      settings.language = 'en';
      return settings;
    } catch {
      return this.getDefaultSettings();
    }
  }

  // Save audio description settings
  saveSettings(settings: AudioDescriptionSettings): void {
    if (typeof window !== 'undefined') {
      // Force English language before saving
      const settingsToSave = { ...settings, language: 'en' };
      localStorage.setItem(this.storageKey, JSON.stringify(settingsToSave));
    }
  }

  // Default settings - public method
  getDefaultSettings(): AudioDescriptionSettings {
    return {
      enabled: false,
      voice: 'EXAVITQu4vr4xnSDxMaL', // Bella voice (clear female voice)
      speed: 1.0,
      autoDescribe: false,
      language: 'en', // Always English
      stability: 0.75,
      similarityBoost: 0.85,
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

    // Generate description based on element type (always in English)
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

    // Cancel any previous request
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      this.isPlaying = true;
      console.log('🔊 Attempting speech synthesis:', text.substring(0, 50) + '...');
      
      // Try ElevenLabs first
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          voice: settings.voice,
          speed: settings.speed,
          language: 'en', // Force English
          stability: settings.stability,
          similarityBoost: settings.similarityBoost,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 API Response:', { success: data.success, provider: data.provider, useWebSpeech: data.useWebSpeech });

      if (data.audioData && !data.useWebSpeech) {
        // Use ElevenLabs audio
        console.log('🎵 Using ElevenLabs');
        const audio = new Audio(data.audioData);
        this.currentAudio = audio;
        
        audio.onloadstart = () => console.log('🔄 Loading audio...');
        audio.oncanplay = () => console.log('✅ Audio ready to play');
        audio.onplay = () => console.log('▶️ Audio playback started');
        
        audio.onended = () => {
          console.log('⏹️ Audio playback ended');
          this.isPlaying = false;
          this.currentAudio = null;
        };
        
        audio.onerror = (error) => {
          console.error('❌ Audio playback error:', error);
          this.isPlaying = false;
          this.currentAudio = null;
          // Fallback to Web Speech API
          this.fallbackToWebSpeech(text);
        };
        
        await audio.play();
      } else {
        // Fallback to Web Speech API
        console.log('🗣️ Fallback to Web Speech API');
        this.fallbackToWebSpeech(text);
      }
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('🚫 Audio request cancelled');
        return;
      }
      
      console.error('❌ Audio description error:', error);
      this.isPlaying = false;
      this.fallbackToWebSpeech(text);
    }
  }

  // Fallback to Web Speech API
  private fallbackToWebSpeech(text: string): void {
    console.log('🗣️ Using Web Speech API');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice for English
      utterance.lang = 'en-US';
      utterance.rate = this.getSettings().speed;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to find an appropriate English voice
      const voices = window.speechSynthesis.getVoices();
      console.log('🎤 Available voices:', voices.length);
      
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('🎤 Selected voice:', preferredVoice.name);
      }
      
      utterance.onstart = () => {
        console.log('▶️ Web Speech started');
        this.isPlaying = true;
      };
      
      utterance.onend = () => {
        console.log('⏹️ Web Speech ended');
        this.isPlaying = false;
      };
      
      utterance.onerror = (error) => {
        console.error('❌ Web Speech API error:', error);
        this.isPlaying = false;
      };
      
      // Ensure voices are loaded
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } else {
      this.isPlaying = false;
      console.warn('⚠️ Web Speech API not supported');
    }
  }

  // Stop current audio
  stop(): void {
    console.log('🛑 Stopping audio description');
    
    // Cancel ongoing requests
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Stop ElevenLabs audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    // Stop Web Speech API
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
    if (!settings.enabled) return;
    
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
    
    if (buttons > 0) description += `${buttons} button${buttons > 1 ? 's' : ''} available. `;
    if (links > 0) description += `${links} link${links > 1 ? 's' : ''} available. `;
    if (inputs > 0) description += `${inputs} form control${inputs > 1 ? 's' : ''} available. `;
    
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
        description += `Menu ${index + 1} has ${links.length} item${links.length > 1 ? 's' : ''}. `;
      });
    }
    
    await this.speak(description);
  }

  // Get available voices for ElevenLabs
  async getAvailableVoices(): Promise<Array<{id: string, name: string, category: string}>> {
    try {
      const response = await fetch('/api/elevenlabs-voices');
      if (response.ok) {
        const data = await response.json();
        return data.voices || this.getDefaultVoices();
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
    
    return this.getDefaultVoices();
  }

  // Default voices if API fails
  private getDefaultVoices(): Array<{id: string, name: string, category: string}> {
    return [
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', category: 'premade' },
      { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', category: 'premade' },
      { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', category: 'premade' },
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', category: 'premade' },
    ];
  }
}

export const audioDescriptionService = new AudioDescriptionService();