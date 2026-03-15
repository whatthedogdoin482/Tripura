import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1B262C] text-[#BBE1FA]">
      <h1 className="text-2xl font-bold mb-4">Seite nicht gefunden</h1>
      <p className="text-center mb-6 max-w-md">Die angeforderte Seite existiert nicht.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full font-bold bg-[#3282B8] text-white hover:bg-[#4698cf] transition-colors"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
