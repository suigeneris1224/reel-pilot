'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',          icon: '⬡', label: 'Overview'  },
  { href: '/builder',   icon: '✦', label: 'Builder'   },
  { href: '/dashboard', icon: '◫', label: 'Dashboard' },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 flex flex-col z-40"
      style={{ background: 'var(--c-surface)', borderRight: '1px solid var(--c-border)' }}>

      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm"
          style={{ background: 'var(--c-accent)' }}>
          RP
        </div>
        <span className="font-display font-700 text-sm tracking-wide" style={{ color: 'var(--c-text)' }}>
          ReelPilot
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, icon, label }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                active
                  ? 'text-white font-medium'
                  : 'hover:text-white'
              )}
              style={{
                color:      active ? '#fff' : 'var(--c-muted)',
                background: active ? 'rgba(79,110,247,0.15)' : 'transparent',
                border:     active ? '1px solid rgba(79,110,247,0.3)' : '1px solid transparent',
              }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span className="font-display tracking-wide">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Phase badge */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)' }}>
          <p style={{ color: 'var(--c-accent)' }} className="font-display font-medium mb-0.5">Phase 1</p>
          <p style={{ color: 'var(--c-muted)' }}>Script generation</p>
        </div>
      </div>
    </aside>
  )
}
