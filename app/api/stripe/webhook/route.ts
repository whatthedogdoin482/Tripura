import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getStripeServer } from '@/lib/stripe/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/log'

/** Order anhand der Stripe-Session aktualisieren (Webhook → orders-Tabelle) */
async function updateOrderFromSession(session: Stripe.Checkout.Session, status: 'paid' | 'failed') {
  const supabase = getAdminClient()
  const orderId = session.metadata?.order_id ?? session.client_reference_id

  const update = {
    status,
    stripe_session_id: session.id,
    amount_total: session.amount_total ?? null,
    currency: session.currency ?? 'eur',
  }

  if (orderId) {
    const { error } = await supabase.from('orders').update(update).eq('id', orderId)
    if (!error) return
    logger.error('stripe.webhook', 'order update by id failed', { orderId, error: error.message })
  }

  // Fallback: über stripe_session_id matchen, sonst neue Zeile anlegen
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle()

  if (existing) {
    await supabase.from('orders').update(update).eq('id', existing.id)
  } else {
    await supabase.from('orders').insert({ ...update, user_id: null })
  }
}

export async function POST(request: Request) {
  const stripe = getStripeServer()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      logger.info('stripe.webhook', 'checkout completed', {
        sessionId: session.id,
        orderId: session.metadata?.order_id ?? session.client_reference_id,
      })
      try {
        await updateOrderFromSession(session, 'paid')
      } catch (err) {
        logger.error('stripe.webhook', 'order update failed', {
          error: err instanceof Error ? err.message : String(err),
        })
      }
      break
    }
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      try {
        await updateOrderFromSession(session, 'failed')
      } catch (err) {
        logger.error('stripe.webhook', 'order update failed', {
          error: err instanceof Error ? err.message : String(err),
        })
      }
      break
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      break
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.warn('PaymentIntent failed:', paymentIntent.id)
      break
    }
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
