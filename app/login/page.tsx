import type { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Sign In | GlobalTrade SCMS',
  description: 'Sign in to your GlobalTrade SCMS enterprise account to manage supply chains, shipments, and inventory.'
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}
