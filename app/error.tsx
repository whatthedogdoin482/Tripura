'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1B262C] text-[#BBE1FA]">
      <h1 className="text-2xl font-bold mb-4">Etwas ist schiefgelaufen</h1>
      <p className="text-center mb-6 max-w-md">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full font-bold bg-[#3282B8] text-white hover:bg-[#4698cf] transition-colors"
      >
        Nochmal versuchen
      </button>
    </div>
  );
}
