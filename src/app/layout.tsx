import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetBrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Agent UI',
  description:
    'Your unified access to workflows, redefining human-AI interactions',
  icons: {
    icon: '/robot.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
