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
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href={`${basePath}/icons/windows.png`} as="image" />
        <link rel="preload" href={`${basePath}/icons/about.png`} as="image" />
        <link rel="preload" href={`${basePath}/wallpapers/windows11.jpg`} as="image" />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased select-none">
        {children}
      </body>
    </html>
  );
}
