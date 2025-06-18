import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speed } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    if (!ELEVENLABS_API_KEY) {
      // Fallback to browser speech synthesis
      return NextResponse.json({ 
        useWebSpeech: true,
        text: text,
        message: 'Using browser speech synthesis'
      });
    }

    // Use provided voice or default
    const voiceId = voice || 'EXAVITQu4vr4xnSDxMaL'; // Bella voice
    const speechSpeed = speed || 1.0;

    // Call ElevenLabs API with optimized settings
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
          speaking_rate: speechSpeed, // Control speech speed
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      audioData: `data:audio/mpeg;base64,${audioBase64}`,
      success: true,
      provider: 'elevenlabs'
    });

  } catch (error: any) {
    console.error('ElevenLabs TTS error:', error);
    
    // Fallback to browser speech synthesis
    return NextResponse.json({ 
      useWebSpeech: true,
      text: request.body ? JSON.parse(await request.text()).text : '',
      success: false,
      fallback: true,
      message: 'Using browser speech synthesis (API error)'
    });
  }
}