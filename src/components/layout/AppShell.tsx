'use client'

import { Sidebar } from './Sidebar'
import { UserButton } from '@clerk/nextjs'

interface AppShellProps {
  children: React.ReactNode
  title?: string
}

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60 min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-800">{title || 'MDXsoftware'}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Modexa Construction</span>
            <UserButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8FAFC' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
