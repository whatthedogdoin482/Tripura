import { NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

export type CheckoutSessionBody = {
  /** Optional: Stripe Price ID. If omitted, amount and product info can be passed. */
  priceId?: string
  /** Optional: amount in cents (e.g. 1999 = €19.99). Use when not using priceId. */
  amount?: number
  /** Optional: product name for ad-hoc checkout */
  name?: string
  /** Optional: success URL override */
  successUrl?: string
  /** Optional: cancel URL override */
  cancelUrl?: string
  /** Optional: client_reference_id (e.g. user or order id) */
  clientReferenceId?: string
}

export async function POST(request: Request) {
  try {
    const stripe = getStripeServer()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const body = (await request.json()) as CheckoutSessionBody

    const successUrl = body.successUrl ?? `${baseUrl}${STRIPE_CONFIG.successUrlSuffix}`
    const cancelUrl = body.cancelUrl ?? `${baseUrl}${STRIPE_CONFIG.cancelUrlSuffix}`

    const sessionParams: {
      mode: 'payment'
      success_url: string
      cancel_url: string
      client_reference_id?: string
      line_items: Array<
        | { price: string; quantity: number }
        | { price_data: { currency: string; unit_amount: number; product_data: { name: string } }; quantity: number }
      >
    } = {
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [],
    }

    if (body.clientReferenceId) {
      sessionParams.client_reference_id = body.clientReferenceId
    }

    if (body.priceId) {
      sessionParams.line_items.push({ price: body.priceId, quantity: 1 })
    } else if (body.amount != null && body.amount > 0) {
      sessionParams.line_items.push({
        price_data: {
          currency: STRIPE_CONFIG.currency,
          unit_amount: body.amount,
          product_data: {
            name: body.name ?? 'Tripura Payment',
          },
        },
        quantity: 1,
      })
    } else {
      return NextResponse.json(
        { error: 'Provide either priceId or amount (in cents)' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout failed' },
      { status: 500 }
    )
  }
}
