import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'FacelessReels — AI Reel Generator',
  description: 'Generate and auto-post faceless reels to TikTok, Instagram & YouTube on autopilot.',
  icons:       { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
