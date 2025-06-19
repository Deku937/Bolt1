import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speed, language, stability, similarityBoost } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Texte requis' }, { status: 400 });
    }

    if (!ELEVENLABS_API_KEY) {
      console.warn('Clé API ElevenLabs manquante, utilisation du fallback Web Speech');
      return NextResponse.json({ 
        useWebSpeech: true,
        text: text,
        message: 'Utilisation de la synthèse vocale du navigateur'
      });
    }

    // Utiliser la voix fournie ou une voix par défaut
    const voiceId = voice || 'EXAVITQu4vr4xnSDxMaL'; // Bella voice
    const speechSpeed = speed || 1.0;
    const voiceStability = stability || 0.75;
    const voiceSimilarityBoost = similarityBoost || 0.85;

    // Appeler l'API ElevenLabs avec des paramètres optimisés
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2', // Modèle plus rapide pour les descriptions audio
        voice_settings: {
          stability: voiceStability,
          similarity_boost: voiceSimilarityBoost,
          style: 0.3,
          use_speaker_boost: true,
          speaking_rate: speechSpeed,
        },
        // Paramètres additionnels pour l'optimisation
        optimize_streaming_latency: 3, // Optimisation pour la latence
        output_format: 'mp3_44100_128', // Format optimisé
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API ElevenLabs: ${response.status} - ${errorText}`);
      
      // Fallback vers Web Speech API en cas d'erreur
      return NextResponse.json({ 
        useWebSpeech: true,
        text: text,
        success: false,
        fallback: true,
        message: 'Erreur API ElevenLabs, utilisation du fallback navigateur'
      });
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      audioData: `data:audio/mpeg;base64,${audioBase64}`,
      success: true,
      provider: 'elevenlabs',
      voiceId: voiceId,
      settings: {
        speed: speechSpeed,
        stability: voiceStability,
        similarityBoost: voiceSimilarityBoost,
      }
    });

  } catch (error: any) {
    console.error('Erreur ElevenLabs TTS:', error);
    
    // Fallback vers Web Speech API
    const requestBody = await request.json().catch(() => ({}));
    return NextResponse.json({ 
      useWebSpeech: true,
      text: requestBody.text || '',
      success: false,
      fallback: true,
      error: error.message,
      message: 'Erreur serveur, utilisation de la synthèse vocale du navigateur'
    });
  }
}