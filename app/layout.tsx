import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Mando & Grogu Tracker',
  description: 'Dashboard checklist para controlar el visionado hasta The Mandalorian & Grogu',
  manifest: '/manifest.json',
  themeColor: '#10b981',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mando Tracker',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#09090b] text-zinc-100 font-sans antialiased min-h-screen selection:bg-emerald-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
