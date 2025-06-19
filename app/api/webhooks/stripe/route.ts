import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      headers: request.headers,
      cookies: request.cookies,
    }
  );

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(supabase, event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(supabase, event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(supabase, event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handlePaymentSucceeded(supabase: any, paymentIntent: Stripe.PaymentIntent) {
  try {
    const sessionId = paymentIntent.metadata.sessionId;
    if (!sessionId) {
      console.error('No session ID in payment intent metadata');
      return;
    }

    const { error: sessionError } = await supabase
      .from('sessions')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (sessionError) console.error('Error updating session:', sessionError);

    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        payment_method_id: paymentIntent.payment_method as string,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (paymentError) console.error('Error updating payment:', paymentError);

    console.log(`Payment succeeded for session ${sessionId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(supabase: any, paymentIntent: Stripe.PaymentIntent) {
  try {
    const sessionId = paymentIntent.metadata.sessionId;
    if (!sessionId) {
      console.error('No session ID in payment intent metadata');
      return;
    }

    const { error: sessionError } = await supabase
      .from('sessions')
      .update({
        payment_status: 'failed',
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (sessionError) console.error('Error updating session:', sessionError);

    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (paymentError) console.error('Error updating payment:', paymentError);

    console.log(`Payment failed for session ${sessionId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCanceled(supabase: any, paymentIntent: Stripe.PaymentIntent) {
  try {
    const sessionId = paymentIntent.metadata.sessionId;
    if (!sessionId) {
      console.error('No session ID in payment intent metadata');
      return;
    }

    const { error: sessionError } = await supabase
      .from('sessions')
      .update({
        payment_status: 'cancelled',
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (sessionError) console.error('Error updating session:', sessionError);

    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (paymentError) console.error('Error updating payment:', paymentError);

    console.log(`Payment canceled for session ${sessionId}`);
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}
