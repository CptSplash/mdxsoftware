'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  HardHat,
  ClipboardList,
  FileText,
  BookOpen,
  Archive,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/tradies', label: 'Tradies', icon: HardHat },
  { href: '/work-orders', label: 'Work Orders', icon: ClipboardList },
  { href: '/claims', label: 'Claims', icon: FileText },
  { href: '/diary', label: 'Site Diary', icon: BookOpen },
  { href: '/repository', label: 'Repository', icon: Archive },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-30"
      style={{ backgroundColor: '#1E3A5F' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-2xl font-bold text-white">MDX</span>
        <span className="text-2xl font-bold" style={{ color: '#F59E0B' }}>software</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative',
                active
                  ? 'text-white bg-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              )}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ backgroundColor: '#F59E0B' }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom settings */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
            pathname === '/settings'
              ? 'text-white bg-white/10'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
