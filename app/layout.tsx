import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { AuthProvider } from '@/context/AuthContext';
import { PreferencesProvider } from '@/context/PreferencesContext';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'GlobalTrade SCMS',
  description: 'Global Trade & Supply Chain Management System'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Suppress third-party browser extension errors from triggering Next.js dev error overlay */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  window.addEventListener('error', function(e) {
                    var isExt = (e.filename && (e.filename.indexOf('chrome-extension://') !== -1 || e.filename.indexOf('moz-extension://') !== -1 || e.filename.indexOf('edge-extension://') !== -1)) ||
                                (e.error && e.error.stack && (e.error.stack.indexOf('chrome-extension://') !== -1 || e.error.stack.indexOf('moz-extension://') !== -1));
                    if (isExt) {
                      e.stopImmediatePropagation();
                    }
                  }, true);
                  window.addEventListener('unhandledrejection', function(e) {
                    var isExt = e.reason && e.reason.stack && (e.reason.stack.indexOf('chrome-extension://') !== -1 || e.reason.stack.indexOf('moz-extension://') !== -1);
                    if (isExt) {
                      e.stopImmediatePropagation();
                    }
                  }, true);
                }
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <PreferencesProvider>
            <AppShell>{children}</AppShell>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


