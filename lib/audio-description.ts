// Service d'audio description utilisant l'API ElevenLabs
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

  // Obtenir les paramètres d'audio description de l'utilisateur
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

  // Sauvegarder les paramètres d'audio description
  saveSettings(settings: AudioDescriptionSettings): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }
  }

  // Paramètres par défaut - méthode publique
  getDefaultSettings(): AudioDescriptionSettings {
    return {
      enabled: false,
      voice: 'EXAVITQu4vr4xnSDxMaL', // Bella voice (voix féminine claire)
      speed: 1.0,
      autoDescribe: false,
      language: 'fr', // Français par défaut
      stability: 0.75,
      similarityBoost: 0.85,
    };
  }

  // Générer une description audio pour les éléments UI
  async describeElement(element: HTMLElement, customText?: string): Promise<void> {
    const settings = this.getSettings();
    if (!settings.enabled) return;

    let description = customText;
    
    if (!description) {
      description = this.generateElementDescription(element, settings.language);
    }

    if (description) {
      await this.speak(description);
    }
  }

  // Générer le texte de description pour un élément
  private generateElementDescription(element: HTMLElement, language: string): string {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const title = element.getAttribute('title');
    const textContent = element.textContent?.trim();

    // Utiliser aria-label ou title si disponible
    if (ariaLabel) return ariaLabel;
    if (title) return title;

    // Générer la description basée sur le type d'élément et la langue
    const descriptions = this.getDescriptionTemplates(language);

    switch (tagName) {
      case 'button':
        return `${descriptions.button}: ${textContent || descriptions.unlabeledButton}`;
      case 'input':
        const inputType = element.getAttribute('type') || 'text';
        const placeholder = element.getAttribute('placeholder');
        return `${descriptions.input} ${inputType}${placeholder ? `: ${placeholder}` : ''}`;
      case 'a':
        return `${descriptions.link}: ${textContent || descriptions.unlabeledLink}`;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return `${descriptions.heading} ${tagName.charAt(1)}: ${textContent}`;
      case 'img':
        const alt = element.getAttribute('alt');
        return `${descriptions.image}: ${alt || descriptions.noDescription}`;
      case 'nav':
        return descriptions.navigation;
      case 'main':
        return descriptions.mainContent;
      case 'aside':
        return descriptions.sidebar;
      case 'footer':
        return descriptions.footer;
      case 'header':
        return descriptions.header;
      default:
        if (role) {
          return `${role}: ${textContent || descriptions.interactiveElement}`;
        }
        return textContent || descriptions.interactiveElement;
    }
  }

  // Templates de description multilingues
  private getDescriptionTemplates(language: string) {
    const templates = {
      fr: {
        button: 'Bouton',
        unlabeledButton: 'bouton sans étiquette',
        input: 'Champ de saisie',
        link: 'Lien',
        unlabeledLink: 'lien sans étiquette',
        heading: 'Titre de niveau',
        image: 'Image',
        noDescription: 'aucune description disponible',
        navigation: 'Menu de navigation',
        mainContent: 'Contenu principal',
        sidebar: 'Barre latérale',
        footer: 'Pied de page',
        header: 'En-tête',
        interactiveElement: 'élément interactif',
      },
      en: {
        button: 'Button',
        unlabeledButton: 'unlabeled button',
        input: 'Input field',
        link: 'Link',
        unlabeledLink: 'unlabeled link',
        heading: 'Heading level',
        image: 'Image',
        noDescription: 'no description available',
        navigation: 'Navigation menu',
        mainContent: 'Main content area',
        sidebar: 'Sidebar content',
        footer: 'Footer content',
        header: 'Header content',
        interactiveElement: 'interactive element',
      }
    };

    return templates[language as keyof typeof templates] || templates.en;
  }

  // Parler le texte en utilisant ElevenLabs ou fallback vers Web Speech API
  async speak(text: string): Promise<void> {
    if (this.isPlaying) {
      this.stop();
    }

    const settings = this.getSettings();
    if (!settings.enabled) return;

    // Annuler toute requête précédente
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      this.isPlaying = true;
      console.log('🔊 Tentative de synthèse vocale:', text.substring(0, 50) + '...');
      
      // Essayer ElevenLabs d'abord
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          voice: settings.voice,
          speed: settings.speed,
          language: settings.language,
          stability: settings.stability,
          similarityBoost: settings.similarityBoost,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 Réponse API:', { success: data.success, provider: data.provider, useWebSpeech: data.useWebSpeech });

      if (data.audioData && !data.useWebSpeech) {
        // Utiliser l'audio ElevenLabs
        console.log('🎵 Utilisation d\'ElevenLabs');
        const audio = new Audio(data.audioData);
        this.currentAudio = audio;
        
        audio.onloadstart = () => console.log('🔄 Chargement audio...');
        audio.oncanplay = () => console.log('✅ Audio prêt à jouer');
        audio.onplay = () => console.log('▶️ Lecture audio démarrée');
        
        audio.onended = () => {
          console.log('⏹️ Lecture audio terminée');
          this.isPlaying = false;
          this.currentAudio = null;
        };
        
        audio.onerror = (error) => {
          console.error('❌ Erreur de lecture audio:', error);
          this.isPlaying = false;
          this.currentAudio = null;
          // Fallback vers Web Speech API
          this.fallbackToWebSpeech(text, settings);
        };
        
        await audio.play();
      } else {
        // Fallback vers Web Speech API
        console.log('🗣️ Fallback vers Web Speech API');
        this.fallbackToWebSpeech(text, settings);
      }
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('🚫 Requête audio annulée');
        return;
      }
      
      console.error('❌ Erreur audio description:', error);
      this.isPlaying = false;
      this.fallbackToWebSpeech(text, settings);
    }
  }

  // Fallback vers Web Speech API
  private fallbackToWebSpeech(text: string, settings: AudioDescriptionSettings): void {
    console.log('🗣️ Utilisation de Web Speech API');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configuration de la voix
      utterance.lang = settings.language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = settings.speed;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Essayer de trouver une voix appropriée
      const voices = window.speechSynthesis.getVoices();
      console.log('🎤 Voix disponibles:', voices.length);
      
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(settings.language) && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith(settings.language));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('🎤 Voix sélectionnée:', preferredVoice.name);
      }
      
      utterance.onstart = () => {
        console.log('▶️ Web Speech démarré');
        this.isPlaying = true;
      };
      
      utterance.onend = () => {
        console.log('⏹️ Web Speech terminé');
        this.isPlaying = false;
      };
      
      utterance.onerror = (error) => {
        console.error('❌ Erreur Web Speech API:', error);
        this.isPlaying = false;
      };
      
      // S'assurer que les voix sont chargées
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } else {
      this.isPlaying = false;
      console.warn('⚠️ Web Speech API non supportée');
    }
  }

  // Arrêter l'audio actuel
  stop(): void {
    console.log('🛑 Arrêt de l\'audio description');
    
    // Annuler les requêtes en cours
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Arrêter l'audio ElevenLabs
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    // Arrêter Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    this.isPlaying = false;
  }

  // Vérifier si en cours de lecture
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Décrire automatiquement le contenu de la page
  async describePageContent(): Promise<void> {
    const settings = this.getSettings();
    if (!settings.enabled) return;

    const descriptions = this.getDescriptionTemplates(settings.language);
    
    // Obtenir les zones de contenu principales
    const main = document.querySelector('main');
    const headings = document.querySelectorAll('h1, h2, h3');
    
    let description = settings.language === 'fr' ? 'Page chargée. ' : 'Page loaded. ';
    
    // Décrire le titre principal
    const mainHeading = headings[0];
    if (mainHeading) {
      const headingText = settings.language === 'fr' ? 'Titre principal' : 'Main heading';
      description += `${headingText}: ${mainHeading.textContent}. `;
    }
    
    // Compter les éléments interactifs
    const buttons = document.querySelectorAll('button').length;
    const links = document.querySelectorAll('a').length;
    const inputs = document.querySelectorAll('input, select, textarea').length;
    
    if (settings.language === 'fr') {
      if (buttons > 0) description += `${buttons} bouton${buttons > 1 ? 's' : ''} disponible${buttons > 1 ? 's' : ''}. `;
      if (links > 0) description += `${links} lien${links > 1 ? 's' : ''} disponible${links > 1 ? 's' : ''}. `;
      if (inputs > 0) description += `${inputs} champ${inputs > 1 ? 's' : ''} de formulaire disponible${inputs > 1 ? 's' : ''}. `;
      description += 'Utilisez Tab pour naviguer, Entrée pour activer, ou activez la description automatique pour une navigation détaillée.';
    } else {
      if (buttons > 0) description += `${buttons} button${buttons > 1 ? 's' : ''} available. `;
      if (links > 0) description += `${links} link${links > 1 ? 's' : ''} available. `;
      if (inputs > 0) description += `${inputs} form control${inputs > 1 ? 's' : ''} available. `;
      description += 'Use Tab to navigate, Enter to activate, or enable auto-describe for detailed navigation.';
    }
    
    await this.speak(description);
  }

  // Décrire la structure de navigation
  async describeNavigation(): Promise<void> {
    const settings = this.getSettings();
    if (!settings.enabled) return;

    const navElements = document.querySelectorAll('nav');
    let description = '';
    
    if (navElements.length === 0) {
      description = settings.language === 'fr' 
        ? 'Aucun menu de navigation trouvé sur cette page.'
        : 'No navigation menus found on this page.';
    } else {
      if (settings.language === 'fr') {
        description = `${navElements.length} menu${navElements.length > 1 ? 's' : ''} de navigation disponible${navElements.length > 1 ? 's' : ''}. `;
        navElements.forEach((nav, index) => {
          const links = nav.querySelectorAll('a, button');
          description += `Menu ${index + 1} contient ${links.length} élément${links.length > 1 ? 's' : ''}. `;
        });
      } else {
        description = `${navElements.length} navigation menu${navElements.length > 1 ? 's' : ''} available. `;
        navElements.forEach((nav, index) => {
          const links = nav.querySelectorAll('a, button');
          description += `Menu ${index + 1} has ${links.length} item${links.length > 1 ? 's' : ''}. `;
        });
      }
    }
    
    await this.speak(description);
  }

  // Obtenir les voix disponibles pour ElevenLabs
  async getAvailableVoices(): Promise<Array<{id: string, name: string, category: string}>> {
    try {
      const response = await fetch('/api/elevenlabs-voices');
      if (response.ok) {
        const data = await response.json();
        return data.voices || this.getDefaultVoices();
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des voix:', error);
    }
    
    return this.getDefaultVoices();
  }

  // Voix par défaut si l'API échoue
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