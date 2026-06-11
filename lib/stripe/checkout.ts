export interface CheckoutItem {
  type: string
  id: string
  label: string
  price: number
}

export interface CheckoutOptions {
  /** Betrag in Cent (z.B. 1999 = 19,99 €) */
  amount: number
  /** Produktname im Stripe-Checkout */
  name?: string
  /** Sub-Buchungen für die orders-Tabelle */
  items?: CheckoutItem[]
  tripId?: string
}

/**
 * Startet einen Stripe-Checkout: legt serverseitig eine pending Order an
 * und leitet zum Stripe-Hosted-Checkout weiter (Test-Modus mit pk_test/sk_test).
 */
export async function redirectToCheckout(options: CheckoutOptions): Promise<void> {
  const res = await fetch('/api/stripe/checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
    credentials: 'include',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error ?? 'Checkout fehlgeschlagen')
  }
  if (data.url) {
    window.location.href = data.url
  } else {
    throw new Error('Keine Checkout-URL erhalten')
  }
}
