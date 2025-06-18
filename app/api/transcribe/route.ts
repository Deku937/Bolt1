import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
    }

    // Check file size (max 25MB for OpenAI Whisper)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Audio file too large (max 25MB)' 
      }, { status: 400 });
    }

    // Transcription with OpenAI Whisper (optimized for speed)
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // English for faster processing
      response_format: 'text',
      temperature: 0.1, // Lower for faster, more accurate results
    });

    if (!transcription || typeof transcription !== 'string') {
      throw new Error('Transcription failed');
    }

    return NextResponse.json({ 
      text: transcription.trim(),
      success: true 
    });

  } catch (error: any) {
    console.error('Whisper transcription error:', error);
    
    // Fast fallback with common mental health questions
    const simulatedTranscriptions = [
      "How can I manage my anxiety?",
      "I've been feeling depressed lately",
      "What are the symptoms of stress?",
      "How do I book a session on MindWell?",
      "I need help with my mental wellbeing",
      "Can you explain mood tracking?",
      "What are some relaxation techniques?"
    ];
    
    const randomText = simulatedTranscriptions[Math.floor(Math.random() * simulatedTranscriptions.length)];
    
    return NextResponse.json({ 
      text: randomText,
      success: false,
      fallback: true,
      message: "Simulated transcription (API error)"
    });
  }
}