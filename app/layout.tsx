import type {Metadata} from 'next';
import { Outfit, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Star Wars Saga Tracker',
  description: 'Dashboard de seguimiento multi-saga para Star Wars: sigue The Mandalorian & Grogu y Maul antes de sus estrenos.',
  manifest: '/manifest.json',
  themeColor: '#c9a84c',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SW Tracker',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${outfit.variable} ${cormorant.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-surface-1 text-text-body font-sans antialiased min-h-screen selection:bg-glow-success/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
