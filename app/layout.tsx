import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'ScamBud | Crowdsourced Scam Registry',
  description: 'Search and report fraudulent phone numbers, bank accounts, and social media handles in real-time.',
  openGraph: {
    title: 'ScamBud | Stop the Scam',
    description: 'Verify suspicious contacts before you pay.',
    images: ['/og-image.png'], 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#0a0a0c] text-slate-200 antialiased font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}