import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripeServer } from '@/lib/stripe/server'
import { STRIPE_CONFIG } from '@/lib/stripe/config'
import { getSession } from '@/lib/auth/session'
import { getAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, parseBody } from '@/lib/api/guard'
import { logger } from '@/lib/log'

const bodySchema = z.object({
  /** Stripe Price ID – alternativ zu amount */
  priceId: z.string().optional(),
  /** Betrag in Cent (z.B. 1999 = 19,99 €), max. 50.000 € */
  amount: z.number().int().positive().max(5_000_000).optional(),
  name: z.string().max(200).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  clientReferenceId: z.string().max(200).optional(),
  /** Sub-Buchungen (Flug, Hotel, ...) – wird in orders.items gespeichert */
  items: z
    .array(
      z.object({
        type: z.string().max(50),
        id: z.string().max(100),
        label: z.string().max(200),
        price: z.number(),
      }),
    )
    .max(50)
    .optional(),
  tripId: z.string().uuid().optional(),
})

export type CheckoutSessionBody = z.infer<typeof bodySchema>

export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'stripe.checkout', 10, 60 * 60 * 1000)
  if (limited) return limited

  try {
    const stripe = getStripeServer()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const parsed = await parseBody(request, bodySchema, 'stripe.checkout')
    if (parsed.response) return parsed.response
    const body = parsed.data

    const successUrl = body.successUrl ?? `${baseUrl}${STRIPE_CONFIG.successUrlSuffix}`
    const cancelUrl = body.cancelUrl ?? `${baseUrl}${STRIPE_CONFIG.cancelUrlSuffix}`

    const sessionParams: {
      mode: 'payment'
      success_url: string
      cancel_url: string
      client_reference_id?: string
      metadata?: Record<string, string>
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

    if (body.priceId) {
      sessionParams.line_items.push({ price: body.priceId, quantity: 1 })
    } else if (body.amount != null) {
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

    // Pending-Order anlegen (Nutzer optional – Gast-Checkout bleibt möglich)
    const authSession = await getSession()
    let orderId: string | null = null
    try {
      const supabase = getAdminClient()
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: authSession?.sub ?? null,
          trip_id: body.tripId ?? null,
          amount_total: body.amount ?? null,
          currency: STRIPE_CONFIG.currency,
          status: 'pending',
          items: body.items ?? null,
        })
        .select('id')
        .single()
      if (error) {
        logger.error('stripe.checkout', 'order insert error', { error: error.message })
      } else {
        orderId = order.id
      }
    } catch (err) {
      logger.error('stripe.checkout', 'order insert failed', {
        error: err instanceof Error ? err.message : String(err),
      })
    }

    if (orderId) {
      sessionParams.client_reference_id = orderId
      sessionParams.metadata = { order_id: orderId }
    } else if (body.clientReferenceId) {
      sessionParams.client_reference_id = body.clientReferenceId
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Stripe-Session-ID in der Order hinterlegen, damit der Webhook sie findet
    if (orderId) {
      try {
        const supabase = getAdminClient()
        await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', orderId)
      } catch (err) {
        logger.error('stripe.checkout', 'order session-id update failed', {
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    logger.info('stripe.checkout', 'checkout session created', {
      sessionId: session.id,
      orderId,
      amount: body.amount ?? null,
    })
    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    logger.error('stripe.checkout', 'unexpected error', {
      error: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout failed' },
      { status: 500 }
    )
  }
}
