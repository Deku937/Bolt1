'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Shield, CheckCircle, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookingDetails {
  professional: {
    id: string;
    name: string;
    price: number;
  };
  slot: string;
  type: string;
  duration: number;
  paymentMethod: 'tokens' | 'stripe';
}

interface PaymentFormProps {
  sessionId: string;
  professionalId: string;
  professionalName: string;
  sessionType: string;
  duration: number;
  professionalRate?: number;
  onSuccess: () => void;
  onCancel: () => void;
  bookingDetails?: BookingDetails;
}

interface CheckoutFormProps extends PaymentFormProps {
  clientSecret: string;
  amount: number;
  formattedAmount: string;
}

function CheckoutForm({ 
  professionalName, 
  sessionType, 
  duration, 
  clientSecret, 
  amount, 
  formattedAmount,
  onSuccess, 
  onCancel,
  bookingDetails
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');

  const createSessionAfterPayment = async (paymentIntentId: string) => {
    if (!user || !bookingDetails) return;

    try {
      // Parse the selected slot to get date and time
      const [date, time] = bookingDetails.slot.split(' ');
      const scheduledAt = new Date(`${date} ${time}`).toISOString();
      const priceUsd = amount / 100; // Convert cents to dollars

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          patient_id: user.id,
          professional_id: bookingDetails.professional.id,
          session_type: bookingDetails.type,
          scheduled_at: scheduledAt,
          duration_minutes: bookingDetails.duration,
          price_usd: priceUsd,
          payment_method: 'stripe',
          status: 'confirmed',
          payment_status: 'paid',
          stripe_payment_intent_id: paymentIntentId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        toast.error('Payment successful but failed to create session. Please contact support.');
        return;
      }

      // Create payment record
      await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          session_id: data.id,
          stripe_payment_intent_id: paymentIntentId,
          amount_usd: priceUsd,
          currency: 'usd',
          status: 'succeeded',
        });

      console.log('Session created successfully:', data);
    } catch (error) {
      console.error('Error in post-payment session creation:', error);
      toast.error('Payment successful but failed to create session. Please contact support.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      setPaymentStatus('failed');
      toast.error('Card element not found');
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.email || 'MindWell Patient',
          },
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setPaymentStatus('failed');
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentStatus('succeeded');
        
        // Create session after successful payment
        await createSessionAfterPayment(paymentIntent.id);
        
        toast.success('Payment successful! Your session is confirmed.');
        onSuccess();
      }
    } catch (err: any) {
      console.error('Payment processing error:', err);
      setPaymentStatus('failed');
      toast.error('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'succeeded') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-600">Payment Successful!</h3>
          <p className="text-muted-foreground">
            Your therapy session with {professionalName} has been confirmed.
          </p>
          <Button onClick={onSuccess} className="w-full">
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Secure Payment
          </CardTitle>
        </div>
        
        {/* Session Summary */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Session with</span>
            <span className="font-medium">{professionalName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Type</span>
            <Badge variant="outline" className="capitalize">{sessionType}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="text-sm font-medium">{duration} minutes</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">{formattedAmount}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Credit Card Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Payment Information</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Details</label>
              <div className="p-4 border-2 rounded-lg bg-white focus-within:border-primary transition-colors">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                        iconColor: '#666EE8',
                      },
                      invalid: {
                        color: '#9e2146',
                        iconColor: '#fa755a',
                      },
                      complete: {
                        iconColor: '#666EE8',
                      },
                    },
                    hidePostalCode: false,
                    iconStyle: 'solid',
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your card number, expiry date, CVC, and postal code
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 mb-1">Your payment is secure</p>
              <p>Your payment information is encrypted with 256-bit SSL and processed securely by Stripe. We never store your card details.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay {formattedAmount}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function StripePaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number;
    formattedAmount: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      setError('');

      // Calculate amount directly here since we don't have a session yet
      const basePrice = props.professionalRate || 120;
      const typeMultiplier = props.sessionType === 'audio' ? 0.85 : props.sessionType === 'chat' ? 0.7 : 1.0;
      const durationMultiplier = props.duration === 75 ? 1.5 : props.duration === 30 ? 0.6 : 1.0;
      const amountInCents = Math.round(basePrice * 100 * typeMultiplier * durationMultiplier);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInCents,
          professionalName: props.professionalName,
          sessionType: props.sessionType,
          duration: props.duration,
          // Don't create session yet - we'll do it after payment
          skipSessionCreation: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPaymentDetails({
        amount: data.amount,
        formattedAmount: data.formattedAmount,
      });
    } catch (err: any) {
      console.error('Payment intent creation error:', err);
      setError(err.message || 'Failed to initialize payment');
      toast.error('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Initializing secure payment...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-600">Payment Error</h3>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={props.onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={createPaymentIntent} className="flex-1">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret || !paymentDetails) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-muted-foreground">Failed to initialize payment</p>
          <Button onClick={createPaymentIntent}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        {...props}
        clientSecret={clientSecret}
        amount={paymentDetails.amount}
        formattedAmount={paymentDetails.formattedAmount}
      />
    </Elements>
  );
}