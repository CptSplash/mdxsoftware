import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'

export const metadata: Metadata = {
  title: 'MDXsoftware — Modexa Construction',
  description: 'Construction management platform by Modexa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AppShell>
            {children}
          </AppShell>
        </body>
      </html>
    </ClerkProvider>
  )
}
