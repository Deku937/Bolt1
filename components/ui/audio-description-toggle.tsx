'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Settings, Play, Square } from 'lucide-react';
import { audioDescriptionService } from '@/lib/audio-description';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

export function AudioDescriptionToggle() {
  const [settings, setSettings] = useState(audioDescriptionService.getDefaultSettings());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Array<{id: string, name: string, category: string}>>([]);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    // Charger les paramètres sauvegardés
    const savedSettings = audioDescriptionService.getSettings();
    setSettings(savedSettings);

    // Charger les voix disponibles
    loadAvailableVoices();

    // Vérifier l'état de lecture périodiquement
    const interval = setInterval(() => {
      setIsPlaying(audioDescriptionService.getIsPlaying());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const loadAvailableVoices = async () => {
    try {
      const voices = await audioDescriptionService.getAvailableVoices();
      setAvailableVoices(voices);
    } catch (error) {
      console.error('Erreur lors du chargement des voix:', error);
    }
  };

  const handleToggle = async () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    setSettings(newSettings);
    audioDescriptionService.saveSettings(newSettings);

    if (newSettings.enabled) {
      toast.success('🔊 Audio description activée');
      // Test de la voix
      setTimeout(() => {
        audioDescriptionService.speak('Audio description activée. Vous pouvez maintenant naviguer avec des descriptions vocales.');
      }, 500);
    } else {
      audioDescriptionService.stop();
      toast.info('🔇 Audio description désactivée');
    }
  };

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    audioDescriptionService.saveSettings(newSettings);
  };

  const testVoice = async () => {
    if (isTestingVoice) return;
    
    setIsTestingVoice(true);
    try {
      const testText = settings.language === 'fr' 
        ? 'Ceci est un test de la voix sélectionnée pour l\'audio description.'
        : 'This is a test of the selected voice for audio description.';
      
      await audioDescriptionService.speak(testText);
      toast.success('Test de voix lancé');
    } catch (error) {
      console.error('Erreur lors du test de voix:', error);
      toast.error('Erreur lors du test de voix');
    } finally {
      setIsTestingVoice(false);
    }
  };

  const stopAudio = () => {
    audioDescriptionService.stop();
    setIsPlaying(false);
  };

  const describeCurrentPage = async () => {
    try {
      await audioDescriptionService.describePageContent();
      toast.success('Description de la page lancée');
    } catch (error) {
      console.error('Erreur lors de la description de page:', error);
      toast.error('Erreur lors de la description de page');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Bouton principal toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={`relative transition-all duration-200 ${
          settings.enabled 
            ? 'text-primary hover:text-primary/80 bg-primary/10' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label={settings.enabled ? 'Désactiver audio description' : 'Activer audio description'}
        title={settings.enabled ? 'Audio description activée' : 'Audio description désactivée'}
      >
        {settings.enabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
        
        {/* Indicateur d'état */}
        {settings.enabled && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </Button>

      {/* Bouton stop si en cours de lecture */}
      {isPlaying && (
        <Button
          variant="ghost"
          size="icon"
          onClick={stopAudio}
          className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
          aria-label="Arrêter la lecture audio"
          title="Arrêter la lecture"
        >
          <Square className="w-4 h-4" />
        </Button>
      )}

      {/* Bouton paramètres */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Paramètres audio description"
            title="Configurer l'audio description"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Paramètres Audio Description
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Activation */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enabled">Activer l'audio description</Label>
                <p className="text-xs text-muted-foreground">Descriptions vocales des éléments de l'interface</p>
              </div>
              <Switch
                id="enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              />
            </div>

            {settings.enabled && (
              <>
                {/* Auto-description */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoDescribe">Description automatique</Label>
                    <p className="text-xs text-muted-foreground">Décrire automatiquement au survol</p>
                  </div>
                  <Switch
                    id="autoDescribe"
                    checked={settings.autoDescribe}
                    onCheckedChange={(checked) => handleSettingChange('autoDescribe', checked)}
                  />
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

                {/* Voix */}
                <div className="space-y-2">
                  <Label>Voix</Label>
                  <div className="flex gap-2">
                    <Select
                      value={settings.voice}
                      onValueChange={(value) => handleSettingChange('voice', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name} ({voice.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={testVoice}
                      disabled={isTestingVoice}
                      title="Tester la voix"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Vitesse */}
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

                {/* Stabilité */}
                <div className="space-y-2">
                  <Label>Stabilité de la voix: {Math.round(settings.stability * 100)}%</Label>
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
                  <Label>Clarté de la voix: {Math.round(settings.similarityBoost * 100)}%</Label>
                  <Slider
                    value={[settings.similarityBoost]}
                    onValueChange={([value]) => handleSettingChange('similarityBoost', value)}
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                {/* Actions de test */}
                <div className="space-y-2">
                  <Label>Actions de test</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={testVoice}
                      disabled={isTestingVoice}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Test voix
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={describeCurrentPage}
                      className="flex-1"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Décrire page
                    </Button>
                  </div>
                </div>

                {/* Informations */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    💡 Raccourcis clavier
                  </h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• <kbd>Tab</kbd> : Naviguer entre les éléments</li>
                    <li>• <kbd>Échap</kbd> : Arrêter la lecture audio</li>
                    <li>• <kbd>Entrée</kbd> : Activer l'élément focalisé</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}