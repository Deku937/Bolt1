import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'],
  mode: 'payment' as const,
};

// Session booking prices (in cents for Stripe)
export const SESSION_PRICES = {
  '30_min': 8000,   // $80.00
  '50_min': 12000,  // $120.00
  '75_min': 18000,  // $180.00
} as const;

// Professional rate multipliers by session type
export const SESSION_TYPE_MULTIPLIERS = {
  'video': 1.0,
  'audio': 0.85,
  'chat': 0.7,
} as const;

// Helper function to format price for display
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

// Helper function to get session price
export function getSessionPrice(
  sessionType: string,
  duration: number,
  professionalRate?: number
): number {
  // Use professional's custom rate if available
  if (professionalRate) {
    const basePrice = professionalRate * 100; // Convert to cents
    const typeMultiplier = SESSION_TYPE_MULTIPLIERS[sessionType as keyof typeof SESSION_TYPE_MULTIPLIERS] || 1.0;
    const durationMultiplier = duration === 75 ? 1.5 : duration === 30 ? 0.6 : 1.0;
    
    return Math.round(basePrice * typeMultiplier * durationMultiplier);
  }

  // Default pricing based on duration
  const basePriceKey = duration === 75 ? '75_min' : duration === 30 ? '30_min' : '50_min';
  const basePrice = SESSION_PRICES[basePriceKey];
  
  // Apply session type multiplier
  const typeMultiplier = SESSION_TYPE_MULTIPLIERS[sessionType as keyof typeof SESSION_TYPE_MULTIPLIERS] || 1.0;
  
  return Math.round(basePrice * typeMultiplier);
}

// Validate Stripe configuration
export function validateStripeConfig(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    process.env.STRIPE_SECRET_KEY
  );
}