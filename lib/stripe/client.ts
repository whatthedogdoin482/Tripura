import { loadStripe, type Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

/**
 * Load Stripe.js on the client. Use the publishable key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).
 * Returns the same promise so Stripe is only loaded once.
 */
export function getStripeClient(): Promise<Stripe | null> {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    console.warn('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
    return Promise.resolve(null)
  }
  if (!stripePromise) {
    stripePromise = loadStripe(key)
  }
  return stripePromise
}
