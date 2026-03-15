import type { Metadata } from 'next';
import LoginPage from '@/components/LoginPage';

export const metadata: Metadata = {
  title: 'Anmelden – Tripura',
  description: 'Melde dich bei Tripura an, um Reisen zu speichern und alle Features zu nutzen.',
};

export default function LoginRoute() {
  return <LoginPage />;
}
