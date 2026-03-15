import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-950/30">
        <h1 className="text-2xl font-semibold text-amber-800 dark:text-amber-200">
          Payment cancelled
        </h1>
        <p className="mt-2 text-amber-700 dark:text-amber-300">
          Your payment was not completed. You can try again whenever you’re ready.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
