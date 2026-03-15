import type { Metadata } from 'next';
import RegisterPage from '@/components/RegisterPage';

export const metadata: Metadata = {
  title: 'Registrieren – Tripura',
  description: 'Erstelle dein Tripura-Konto und plane deine nächste Reise.',
};

export default function RegisterRoute() {
  return <RegisterPage />;
}
