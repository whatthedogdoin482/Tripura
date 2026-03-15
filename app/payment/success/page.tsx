import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-md rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950/30">
        <h1 className="text-2xl font-semibold text-green-800 dark:text-green-200">
          Payment successful
        </h1>
        <p className="mt-2 text-green-700 dark:text-green-300">
          Thank you for your payment. You will receive a confirmation by email.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
