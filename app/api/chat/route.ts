import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced system prompt for MindWell AI assistant
const SYSTEM_PROMPT = `You are MindWell's AI assistant, a compassionate and knowledgeable mental health support companion.

ROLE & PERSONALITY:
- Empathetic, professional, and supportive mental health expert
- Warm, understanding, and non-judgmental in all interactions
- Knowledgeable about mental health, therapy techniques, and wellness practices
- Capable of image analysis for mood insights and therapeutic support
- Able to generate calming, therapeutic images when requested

CORE EXPERTISE:
1. Mental Health Support:
   - Anxiety, depression, stress management, and coping strategies
   - Crisis intervention and emergency resource guidance
   - Therapeutic techniques (CBT, mindfulness, breathing exercises)
   - Mood tracking insights and emotional wellness

2. MindWell Platform Guidance:
   - Help users navigate the platform features
   - Explain session booking, mood tracking, and token system
   - Guide users to appropriate professionals and resources
   - Assist with technical questions about the platform

3. Image Capabilities:
   - Analyze uploaded images for mood insights and emotional context
   - Provide therapeutic interpretations of art, photos, or visual journals
   - Generate calming, healing images for meditation and relaxation
   - Create personalized visual content for therapeutic purposes

4. Crisis Support:
   - Immediately provide emergency contacts for crisis situations
   - Guide users to appropriate professional help
   - Offer immediate coping strategies while encouraging professional support

RESPONSE GUIDELINES:
- Keep responses concise but comprehensive (150-300 words typically)
- Use a warm, supportive tone with appropriate empathy
- Provide actionable advice and practical strategies
- Include relevant emojis sparingly for emotional connection
- Always encourage professional help for serious concerns
- Be direct about limitations - you're supportive but not a replacement for therapy

CRISIS PROTOCOL:
If you detect crisis keywords (suicide, self-harm, danger, emergency):
1. Immediately provide crisis resources
2. Encourage immediate professional help
3. Offer grounding techniques
4. Express care and support

RESPONSE FORMAT:
1. Acknowledge the user's feelings/situation with empathy
2. Provide helpful information or guidance
3. Offer practical next steps or coping strategies
4. Mention relevant MindWell features when appropriate
5. Encourage professional support when needed

Remember: You're here to support, guide, and provide resources, but always emphasize that professional mental health care is irreplaceable for serious concerns.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, imageUrl, generateImage } = await request.json();
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'User message required' }, { status: 400 });
    }

    // Enhanced crisis detection
    const urgencyKeywords = [
      'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
      'self harm', 'self-harm', 'cutting', 'hurt myself',
      'overdose', 'pills', 'jump', 'hanging',
      'crisis', 'emergency', 'help me', 'can\'t go on',
      'no point', 'hopeless', 'worthless', 'better off dead'
    ];
    
    const messageContent = lastMessage.content.toLowerCase();
    const isUrgent = urgencyKeywords.some(keyword => 
      messageContent.includes(keyword)
    );

    // Immediate crisis response
    if (isUrgent) {
      return NextResponse.json({
        message: `🚨 **IMMEDIATE CRISIS SUPPORT** 🚨

**GET HELP RIGHT NOW:**
• **Emergency Services: 911**
• **National Suicide Prevention Lifeline: 988**
• **Crisis Text Line: Text HOME to 741741**
• **International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/**

**You are not alone. Your life has value. Help is available 24/7.**

Please reach out to one of these resources immediately. Professional counselors are standing by to help you through this crisis.

💙 The MindWell team cares about you and wants you to stay safe. After you get immediate help, we're here to support your ongoing mental health journey.`
      });
    }

    // Handle image generation requests
    if (generateImage) {
      try {
        // Create a therapeutic image prompt
        const imagePrompt = lastMessage.content.includes('generate') || 
                           lastMessage.content.includes('create') || 
                           lastMessage.content.includes('make')
          ? lastMessage.content
          : `Create a calming, therapeutic image for: ${lastMessage.content}`;

        console.log('🎨 Generating therapeutic image with prompt:', imagePrompt);

        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `Create a beautiful, calming, and therapeutic image: ${imagePrompt}. 
                   Style: peaceful, soft colors, healing atmosphere, wellness-focused, serene, 
                   suitable for meditation and mental health support. Avoid any dark or disturbing elements.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        });

        const generatedImageUrl = imageResponse.data?.[0]?.url;

        if (generatedImageUrl) {
          return NextResponse.json({
            message: `🎨 **Therapeutic Image Created** 🎨

I've created a calming visual for you. This image can be used for:

• **Meditation and mindfulness** - Focus on the peaceful elements
• **Stress relief** - Let the calming colors soothe your mind  
• **Mood enhancement** - Use as a positive visual anchor
• **Therapeutic reflection** - Journal about what you see and feel

💙 Consider sharing your thoughts about this image with a MindWell professional for deeper therapeutic insights and personalized guidance.`,
            imageUrl: generatedImageUrl,
            imageGenerated: true
          });
        }
      } catch (imageError) {
        console.error('Image generation error:', imageError);
        return NextResponse.json({
          message: `I apologize, but I'm having trouble generating an image right now. 

Instead, let me suggest some visualization techniques:

• **Guided imagery** - Close your eyes and imagine a peaceful place
• **Color breathing** - Visualize breathing in calming blue or green light
• **Nature visualization** - Picture yourself in a serene natural setting

💙 You can also explore the visual resources in your MindWell dashboard or discuss visualization techniques with a professional.`
        });
      }
    }

    // Prepare messages for OpenAI (keep conversation context but limit for performance)
    const conversationMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-6).map((msg: any) => {
        if (msg.imageUrl) {
          return {
            role: msg.role,
            content: [
              { type: 'text', text: msg.content },
              { 
                type: 'image_url', 
                image_url: { 
                  url: msg.imageUrl,
                  detail: "low" // Optimize for speed
                }
              }
            ]
          };
        }
        return { role: msg.role, content: msg.content };
      })
    ];

    // Add current image if provided
    if (imageUrl) {
      const lastMessageIndex = conversationMessages.length - 1;
      if (conversationMessages[lastMessageIndex].role === 'user') {
        conversationMessages[lastMessageIndex] = {
          role: 'user',
          content: [
            { type: 'text', text: lastMessage.content },
            { 
              type: 'image_url', 
              image_url: { 
                url: imageUrl,
                detail: "low"
              }
            }
          ]
        };
      }
    }

    console.log('🤖 Sending request to OpenAI with', conversationMessages.length, 'messages');

    // Call OpenAI API with optimized settings
    const completion = await openai.chat.completions.create({
      model: imageUrl ? 'gpt-4o' : 'gpt-4o-mini', // Use vision model only when needed
      messages: conversationMessages as any,
      max_tokens: 400,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      top_p: 0.9,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response generated from OpenAI');
    }

    console.log('✅ OpenAI response generated successfully');

    return NextResponse.json({ 
      message: response,
      model: imageUrl ? 'gpt-4o' : 'gpt-4o-mini',
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('❌ OpenAI Chat API error:', error);
    
    // Enhanced fallback response based on error type
    let fallbackMessage = '';
    
    if (error.code === 'insufficient_quota') {
      fallbackMessage = `I'm experiencing high demand right now. Here's immediate support:

**For anxiety:** Try the 4-7-8 breathing technique (inhale 4s, hold 7s, exhale 8s)
**For stress:** Practice grounding - name 5 things you see, 4 you hear, 3 you touch
**For crisis:** Call 988 (Suicide & Crisis Lifeline) or 911 for emergencies

💙 **MindWell Resources:**
• Book a session with a professional in "Find Professionals"
• Try mood tracking to identify patterns
• Access self-help resources in your dashboard

Please try again in a moment, or connect with a human professional for immediate support.`;
    } else if (error.code === 'rate_limit_exceeded') {
      fallbackMessage = `I'm receiving many requests right now. While you wait:

**Immediate coping strategies:**
• Take 5 deep, slow breaths
• Practice progressive muscle relaxation
• Use the grounding technique (5-4-3-2-1 senses)

**MindWell Support:**
• Browse resources in your dashboard
• Schedule a session with a professional
• Use the mood tracker to process your feelings

💙 Professional support is always available through MindWell's licensed therapists.`;
    } else {
      fallbackMessage = `I'm having a brief technical difficulty. Here's quick mental health support:

**Immediate techniques:**
• **Breathing:** 4-7-8 technique for anxiety
• **Grounding:** 5-4-3-2-1 sensory method
• **Movement:** Light stretching or walking

**Emergency resources:**
• Crisis: 988 or 911
• Text support: HOME to 741741

**MindWell features:**
• Book professional sessions
• Access guided resources
• Track your mood patterns

Please try again, or connect with a licensed professional for personalized support! 🌟`;
    }

    return NextResponse.json({ 
      message: fallbackMessage,
      fallback: true,
      error: error.message 
    });
  }
}