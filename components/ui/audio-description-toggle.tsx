'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Settings, Play, Square } from 'lucide-react';
import { audioDescriptionService, AudioDescriptionSettings } from '@/lib/audio-description';
import { toast } from 'sonner';

export function AudioDescriptionToggle() {
  const [settings, setSettings] = useState<AudioDescriptionSettings>(
    audioDescriptionService.getDefaultSettings()
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Array<{id: string, name: string, category: string, language?: string, gender?: string}>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);

  useEffect(() => {
    // Charger les paramètres sauvegardés
    const savedSettings = audioDescriptionService.getSettings();
    setSettings(savedSettings);
    
    // Vérifier l'état de lecture
    const checkPlayingState = () => {
      setIsPlaying(audioDescriptionService.getIsPlaying());
    };
    
    const interval = setInterval(checkPlayingState, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Charger les voix disponibles quand le dialog s'ouvre
    if (isDialogOpen && availableVoices.length === 0) {
      loadAvailableVoices();
    }
  }, [isDialogOpen]);

  const loadAvailableVoices = async () => {
    setIsLoadingVoices(true);
    try {
      const voices = await audioDescriptionService.getAvailableVoices();
      setAvailableVoices(voices);
    } catch (error) {
      console.error('Erreur lors du chargement des voix:', error);
      toast.error('Impossible de charger les voix disponibles');
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleToggle = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    setSettings(newSettings);
    audioDescriptionService.saveSettings(newSettings);
    
    if (newSettings.enabled) {
      toast.success('Audio description activée');
      // Décrire la page actuelle
      setTimeout(() => {
        audioDescriptionService.describePageContent();
      }, 500);
    } else {
      toast.info('Audio description désactivée');
      audioDescriptionService.stop();
    }
  };

  const handleSettingChange = (key: keyof AudioDescriptionSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    audioDescriptionService.saveSettings(newSettings);
  };

  const handleTestVoice = async () => {
    const testText = settings.language === 'fr' 
      ? 'Ceci est un test de la voix sélectionnée pour l\'audio description.'
      : 'This is a test of the selected voice for audio description.';
    
    try {
      await audioDescriptionService.speak(testText);
      toast.success('Test de la voix en cours...');
    } catch (error) {
      toast.error('Erreur lors du test de la voix');
    }
  };

  const handleStop = () => {
    audioDescriptionService.stop();
    setIsPlaying(false);
  };

  const getVoiceDisplayName = (voice: any) => {
    let displayName = voice.name;
    if (voice.language && voice.language !== 'en') {
      displayName += ` (${voice.language.toUpperCase()})`;
    }
    if (voice.gender) {
      displayName += ` - ${voice.gender === 'female' ? '♀' : '♂'}`;
    }
    return displayName;
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-white/10"
          aria-label={settings.enabled ? 'Audio description activée - Cliquer pour configurer' : 'Audio description désactivée - Cliquer pour activer'}
          title={settings.enabled ? 'Configurer l\'audio description' : 'Activer l\'audio description'}
        >
          {settings.enabled ? (
            <Volume2 className="w-4 h-4 text-primary" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          {settings.enabled && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            Audio Description
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Activation principale */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-audio" className="text-base font-medium">
                Activer l'audio description
              </Label>
              <p className="text-sm text-muted-foreground">
                Descriptions vocales des éléments de l'interface
              </p>
            </div>
            <Switch
              id="enable-audio"
              checked={settings.enabled}
              onCheckedChange={handleToggle}
            />
          </div>

          {settings.enabled && (
            <>
              {/* Sélection de la voix */}
              <div className="space-y-2">
                <Label>Voix</Label>
                <div className="flex gap-2">
                  <Select
                    value={settings.voice}
                    onValueChange={(value) => handleSettingChange('voice', value)}
                    disabled={isLoadingVoices}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={isLoadingVoices ? "Chargement..." : "Sélectionner une voix"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {getVoiceDisplayName(voice)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {isPlaying ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleStop}
                      title="Arrêter la lecture"
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleTestVoice}
                      title="Tester la voix"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Langue */}
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleSettingChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vitesse de lecture */}
              <div className="space-y-2">
                <Label>Vitesse de lecture: {settings.speed.toFixed(1)}x</Label>
                <Slider
                  value={[settings.speed]}
                  onValueChange={([value]) => handleSettingChange('speed', value)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Paramètres avancés */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Paramètres avancés
                </h4>
                
                {/* Stabilité de la voix */}
                <div className="space-y-2">
                  <Label className="text-xs">Stabilité: {(settings.stability * 100).toFixed(0)}%</Label>
                  <Slider
                    value={[settings.stability]}
                    onValueChange={([value]) => handleSettingChange('stability', value)}
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                {/* Similarité */}
                <div className="space-y-2">
                  <Label className="text-xs">Clarté: {(settings.similarityBoost * 100).toFixed(0)}%</Label>
                  <Slider
                    value={[settings.similarityBoost]}
                    onValueChange={([value]) => handleSettingChange('similarityBoost', value)}
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                {/* Description automatique */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Description automatique</Label>
                    <p className="text-xs text-muted-foreground">
                      Décrire automatiquement les pages
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoDescribe}
                    onCheckedChange={(checked) => handleSettingChange('autoDescribe', checked)}
                  />
                </div>
              </div>

              {/* Raccourcis clavier */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Raccourcis clavier</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> : Naviguer entre les éléments</p>
                  <p>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Entrée</kbd> : Activer un élément</p>
                  <p>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Échap</kbd> : Arrêter la lecture</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}