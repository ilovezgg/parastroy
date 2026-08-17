import './globals.css';
import { Unbounded, Golos_Text, JetBrains_Mono } from 'next/font/google';

const unbounded = Unbounded({
  subsets: ['latin','cyrillic'],
  weight: ['200','300','500','700'],
  variable: '--font-unbounded',
  display: 'swap',
});
const golos = Golos_Text({
  subsets: ['latin','cyrillic'],
  weight: ['400','500','600'],
  variable: '--font-golos',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin','cyrillic'],
  weight: ['400','500'],
  variable: '--font-mono',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${golos.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}