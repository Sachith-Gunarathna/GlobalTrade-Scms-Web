import type { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Register | GlobalTrade SCMS',
  description: 'Create an enterprise account on GlobalTrade SCMS to access Sri Lanka logistics corridors and global freight operations.'
};

export default function RegisterPage() {
  return <AuthForm initialMode="register" />;
}
