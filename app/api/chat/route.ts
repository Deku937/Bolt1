import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Optimized system prompt for faster responses
const SYSTEM_PROMPT = `You are MindWell's AI assistant, a compassionate mental health expert with image capabilities.

ROLE: Empathetic, professional mental health support with quick, helpful responses.

EXPERTISE:
1. Mental health: anxiety, depression, stress, coping techniques
2. Image analysis: mood insights, art therapy, visual journaling
3. Image generation: calming visuals, meditation aids
4. MindWell platform: sessions, mood tracking, resources
5. Crisis support: 988 hotline, emergency resources

RESPONSE RULES:
- Keep responses concise (100-200 words max)
- Be direct and actionable
- Use bullet points for clarity
- Include relevant emojis sparingly
- For crisis: immediately provide emergency contacts
- Encourage professional help when needed

RESPONSE FORMAT:
1. Brief empathetic acknowledgment
2. Main advice/information
3. Quick action suggestion
4. MindWell platform mention if relevant`;

export async function POST(request: NextRequest) {
  try {
    const { messages, imageUrl, generateImage } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'User message required' }, { status: 400 });
    }

    // Quick crisis detection
    const urgencyKeywords = ['suicide', 'kill', 'die', 'harm', 'danger', 'crisis', 'emergency'];
    const isUrgent = urgencyKeywords.some(keyword => 
      lastMessage.content.toLowerCase().includes(keyword)
    );

    if (isUrgent) {
      return NextResponse.json({
        message: `🚨 **CRISIS SUPPORT** 🚨

**IMMEDIATE HELP:**
• Emergency: 911
• Suicide Prevention: 988
• Crisis Chat: Available 24/7

You're not alone. Professional help is available right now.

💙 MindWell team is here to support you after this crisis.`
      });
    }

    // Fast image generation
    if (generateImage) {
      try {
        const imagePrompt = lastMessage.content.includes('generate') || lastMessage.content.includes('create') || lastMessage.content.includes('make')
          ? lastMessage.content
          : `Create a calming image for: ${lastMessage.content}`;

        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `Therapeutic, calming image: ${imagePrompt}. Style: peaceful, soft colors, wellness-focused.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        const generatedImageUrl = imageResponse.data?.[0]?.url;

        if (generatedImageUrl) {
          return NextResponse.json({
            message: `🎨 **Therapeutic Image Created!**

This calming visual can help with:
• Meditation & mindfulness
• Stress relief
• Mood enhancement
• Visual therapy

💙 Consider sharing your thoughts about this image with a MindWell professional for deeper insights.`,
            imageUrl: generatedImageUrl,
            imageGenerated: true
          });
        }
      } catch (imageError) {
        console.error('Image generation error:', imageError);
      }
    }

    // Optimized message preparation (keep only last 3 messages for speed)
    const openaiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-3).map((msg: any) => {
        if (msg.imageUrl) {
          return {
            role: msg.role,
            content: [
              { type: 'text', text: msg.content },
              { type: 'image_url', image_url: { url: msg.imageUrl } }
            ]
          };
        }
        return { role: msg.role, content: msg.content };
      })
    ];

    // Add current image if provided
    if (imageUrl) {
      const lastMessageIndex = openaiMessages.length - 1;
      if (openaiMessages[lastMessageIndex].role === 'user') {
        openaiMessages[lastMessageIndex] = {
          role: 'user',
          content: [
            { type: 'text', text: lastMessage.content },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        };
      }
    }

    // Optimized OpenAI call for speed
    const completion = await openai.chat.completions.create({
      model: imageUrl ? 'gpt-4o' : 'gpt-4o-mini', // Use mini for text-only for speed
      messages: openaiMessages as any,
      max_tokens: 250, // Reduced for faster responses
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      // Add speed optimizations
      stream: false,
      top_p: 0.9, // Slightly reduce for faster generation
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response generated');
    }

    return NextResponse.json({ message: response });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Fast fallback response
    const fallbackResponse = `I'm experiencing a brief delay. Here's quick help:

**For anxiety:** Try 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s)
**For stress:** Take 5 deep breaths and ground yourself
**Emergency:** 911 or crisis line: 988
**MindWell:** Book a session in "Find Professionals"

Please try again! 🌟`;

    return NextResponse.json({ message: fallbackResponse });
  }
}