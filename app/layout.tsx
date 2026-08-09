import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mayuresh Portfolio - Windows OS Style Website',
  description:
    'An interactive desktop OS portfolio for Mayuresh featuring a custom boot sequence, draggable window manager, start menu, and 13 functional web apps.',
  keywords: [
    'Mayuresh',
    'Portfolio',
    'Windows OS',
    'Full Stack Engineer',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
  ],
  authors: [{ name: 'Mayuresh' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
