/**
 * Stripe configuration used across the app.
 * Prices and product IDs can be moved to env or a CMS later.
 */
export const STRIPE_CONFIG = {
  /** Currency for Checkout and Payment Intents */
  currency: 'eur',
  /** Success/cancel URLs for Checkout (override when creating session) */
  successUrlSuffix: '/payment/success',
  cancelUrlSuffix: '/payment/cancel',
} as const
