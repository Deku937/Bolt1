import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speed, language, stability, similarityBoost } = await request.json();
    
    console.log('🎤 TTS Request received:', { 
      textLength: text?.length, 
      voice, 
      speed, 
      language: 'en', // Force English
      hasApiKey: !!ELEVENLABS_API_KEY 
    });
    
    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    if (!ELEVENLABS_API_KEY) {
      console.warn('⚠️ ElevenLabs API key missing, using Web Speech fallback');
      return NextResponse.json({ 
        useWebSpeech: true,
        text: text,
        message: 'Using browser speech synthesis'
      });
    }

    // Use provided voice or default
    const voiceId = voice || 'EXAVITQu4vr4xnSDxMaL'; // Bella voice
    const speechSpeed = speed || 1.0;
    const voiceStability = stability || 0.75;
    const voiceSimilarityBoost = similarityBoost || 0.85;

    console.log('🔧 ElevenLabs settings:', {
      voiceId,
      speechSpeed,
      voiceStability,
      voiceSimilarityBoost,
      language: 'en'
    });

    // Call ElevenLabs API with optimized settings for English
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2', // Faster model for audio descriptions
        voice_settings: {
          stability: voiceStability,
          similarity_boost: voiceSimilarityBoost,
          style: 0.3,
          use_speaker_boost: true,
          speaking_rate: speechSpeed,
        },
        // Additional parameters for optimization
        optimize_streaming_latency: 3, // Latency optimization
        output_format: 'mp3_44100_128', // Optimized format
      }),
    });

    console.log('📡 ElevenLabs response:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ElevenLabs API error: ${response.status} - ${errorText}`);
      
      // Fallback to Web Speech API on error
      return NextResponse.json({ 
        useWebSpeech: true,
        text: text,
        success: false,
        fallback: true,
        message: 'ElevenLabs API error, using browser fallback',
        error: `HTTP ${response.status}: ${errorText}`
      });
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    console.log('✅ Audio generated successfully, size:', audioBuffer.byteLength, 'bytes');

    return NextResponse.json({
      audioData: `data:audio/mpeg;base64,${audioBase64}`,
      success: true,
      provider: 'elevenlabs',
      voiceId: voiceId,
      language: 'en',
      settings: {
        speed: speechSpeed,
        stability: voiceStability,
        similarityBoost: voiceSimilarityBoost,
      }
    });

  } catch (error: any) {
    console.error('❌ ElevenLabs TTS error:', error);
    
    // Fallback to Web Speech API
    const requestBody = await request.json().catch(() => ({}));
    return NextResponse.json({ 
      useWebSpeech: true,
      text: requestBody.text || '',
      success: false,
      fallback: true,
      error: error.message,
      message: 'Server error, using browser speech synthesis'
    });
  }
}