import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function GET(request: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ 
        error: 'Clé API ElevenLabs non configurée',
        voices: getDefaultVoices()
      }, { status: 200 });
    }

    // Récupérer les voix disponibles depuis ElevenLabs
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Erreur API ElevenLabs voices: ${response.status}`);
      return NextResponse.json({ 
        error: 'Erreur lors de la récupération des voix',
        voices: getDefaultVoices()
      }, { status: 200 });
    }

    const data = await response.json();
    
    // Filtrer et formater les voix pour l'audio description
    const formattedVoices = data.voices
      .filter((voice: any) => voice.category === 'premade' || voice.category === 'cloned')
      .map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description || '',
        language: voice.labels?.language || 'en',
        gender: voice.labels?.gender || 'unknown',
        age: voice.labels?.age || 'unknown',
        accent: voice.labels?.accent || '',
        use_case: voice.labels?.use_case || '',
      }))
      .sort((a: any, b: any) => {
        // Prioriser les voix françaises et féminines pour l'accessibilité
        if (a.language === 'fr' && b.language !== 'fr') return -1;
        if (a.language !== 'fr' && b.language === 'fr') return 1;
        if (a.gender === 'female' && b.gender !== 'female') return -1;
        if (a.gender !== 'female' && b.gender === 'female') return 1;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json({
      success: true,
      voices: formattedVoices,
      total: formattedVoices.length,
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération des voix ElevenLabs:', error);
    
    return NextResponse.json({ 
      error: 'Erreur serveur',
      voices: getDefaultVoices(),
      fallback: true,
    }, { status: 200 });
  }
}

// Voix par défaut si l'API ElevenLabs n'est pas disponible
function getDefaultVoices() {
  return [
    {
      id: 'EXAVITQu4vr4xnSDxMaL',
      name: 'Bella',
      category: 'premade',
      description: 'Voix féminine claire et agréable',
      language: 'en',
      gender: 'female',
      age: 'young',
      accent: 'american',
      use_case: 'narration',
    },
    {
      id: 'ErXwobaYiN019PkySvjV',
      name: 'Antoni',
      category: 'premade',
      description: 'Voix masculine chaleureuse',
      language: 'en',
      gender: 'male',
      age: 'middle_aged',
      accent: 'american',
      use_case: 'narration',
    },
    {
      id: 'VR6AewLTigWG4xSOukaG',
      name: 'Arnold',
      category: 'premade',
      description: 'Voix masculine profonde',
      language: 'en',
      gender: 'male',
      age: 'middle_aged',
      accent: 'american',
      use_case: 'narration',
    },
    {
      id: 'pNInz6obpgDQGcFmaJgB',
      name: 'Adam',
      category: 'premade',
      description: 'Voix masculine naturelle',
      language: 'en',
      gender: 'male',
      age: 'middle_aged',
      accent: 'american',
      use_case: 'narration',
    },
  ];
}