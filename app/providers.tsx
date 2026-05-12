'use client'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4905213854542365"
          crossOrigin="anonymous"
          strategy="afterInteractive" // Loads the script after the page is interactive
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="dark">{children}</ThemeProvider>
}