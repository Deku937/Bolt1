import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { formatPrice } from '@/lib/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { 
      amount,
      professionalName,
      sessionType,
      duration,
      skipSessionCreation
    } = await request.json();

    if (!amount || !professionalName || !sessionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment intent without session creation
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        professionalName,
        sessionType,
        duration: duration.toString(),
        platform: 'mindwell',
      },
      description: `MindWell Therapy Session - ${professionalName}`,
      receipt_email: undefined, // Will be set from customer email
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: 'usd',
      description: paymentIntent.description,
      formattedAmount: formatPrice(amount),
    });

  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error.message 
      },
      { status: 500 }
    );
  }
}