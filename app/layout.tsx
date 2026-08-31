import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { PreferencesProvider } from '@/context/PreferencesContext';

export const metadata: Metadata = {
  title: 'GlobalTrade SCMS',
  description: 'Global Trade & Supply Chain Management System'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PreferencesProvider>
          <AppShell>{children}</AppShell>
        </PreferencesProvider>
      </body>
    </html>
  );
}
