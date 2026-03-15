import Stripe from 'stripe'

/**
 * Server-side Stripe instance. Use only in API routes, Server Actions, or server code.
 * Never expose the secret key to the client.
 */
function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new Error('Missing STRIPE_SECRET_KEY. Add it to .env.local')
  }
  return new Stripe(secret, {
    typescript: true,
  })
}

// Singleton for the same server request
let stripeInstance: Stripe | null = null

export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    stripeInstance = getStripe()
  }
  return stripeInstance
}
