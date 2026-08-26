import type { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Register | GlobalTrade SCMS',
  description: 'Register an account on GlobalTrade SCMS.'
};

export default function SignUpPage() {
  return <AuthForm initialMode="register" />;
}
