import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetBrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Agent UI',
  description:
    'Your unified access to workflows, redefining human-AI interactions',
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
      </body>
    </html>
  );
}
