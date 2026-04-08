import type {Metadata} from 'next';
import { Inter, Rajdhani, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Star Wars Saga Tracker',
  description: 'Dashboard de seguimiento multi-saga para Star Wars: sigue The Mandalorian & Grogu y Maul antes de sus estrenos.',
  manifest: '/manifest.json',
  themeColor: '#10b981', // updated dynamically per series via SeriesManager
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SW Tracker',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${rajdhani.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-surface-1 text-text-body font-sans antialiased min-h-screen selection:bg-glow-success/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
