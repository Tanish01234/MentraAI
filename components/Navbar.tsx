'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getInitialsFromEmail } from '@/lib/utils/nameExtractor'
import { useUser } from '@/contexts/UserContext'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Use global user context instead of local state to ensure consistency with Profile Page
  const { user, email } = useUser()

  useEffect(() => {
    // console.log('Navbar rendered, user:', user)
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (open || menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Add blur to main content when dropdown is open
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.classList.add('page-blur')
      }
    } else {
      // Remove blur when dropdown closes
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.classList.remove('page-blur')
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.classList.remove('page-blur')
      }
    }
  }, [open, menuOpen])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    // Clear all client state
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }
    router.push('/auth/login')
    router.refresh()
  }

  const initials = getInitialsFromEmail(email || '')

  const navLinks = [
    { href: '/dashboard', label: 'Chat', icon: '💬' },
    { href: '/dashboard/notes', label: 'Notes', icon: '📝' },
    { href: '/dashboard/quiz', label: 'Quiz', icon: '🎯' },
    { href: '/dashboard/career', label: 'Career', icon: '🚀' },
    { href: '/dashboard/exam-planner', label: 'Exam Planner', icon: '📅' },
    { href: '/dashboard/confusion-clarity', label: 'Confusion → Clarity', icon: '💡' },
  ]

  return (
    <nav className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-3 sm:px-4">
      <div className="glass-panel rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/dashboard" className="text-lg sm:text-xl font-bold text-gradient-mantra hover:scale-105 transition-transform duration-300">
            MentraAI
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-pill-modern ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Menu Button (Mobile Only) */}
          <div className="md:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-[var(--bg-elevated)] transition-all duration-200 border border-transparent hover:border-[var(--border-subtle)]"
              aria-label="Navigation Menu"
            >
              <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-black/90 backdrop-blur-xl border border-white/20 p-2 z-50 overflow-hidden animate-scale-in shadow-2xl rounded-2xl">
                <div className="py-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-lg flex items-center gap-3 transition-colors ${pathname === link.href
                        ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-semibold'
                        : 'text-white hover:bg-white/10'
                        }`}
                    >
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 sm:gap-2 p-1 pr-2 sm:pr-3 rounded-full hover:bg-[var(--bg-elevated)] transition-all duration-200 border border-transparent hover:border-[var(--border-subtle)]"
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white flex items-center justify-center font-bold text-xs shadow-md">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-[var(--text-secondary)]">{initials}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-3 w-64 bg-black/90 backdrop-blur-xl border border-white/20 p-2 z-50 overflow-hidden animate-scale-in shadow-2xl rounded-2xl">
                  {/* User Info */}
                  <div className="px-3 py-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white flex items-center justify-center font-semibold shadow-md">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/60">Signed in as</div>
                        <div className="text-sm font-medium text-white truncate">{email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <span className="text-base">👤</span>
                      <span>Profile & History</span>
                    </Link>
                    <Link
                      href="/dashboard/profile/preferences"
                      onClick={() => setOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <span className="text-base">⚙️</span>
                      <span>Preferences</span>
                    </Link>
                    <Link
                      href="/dashboard/profile/privacy"
                      onClick={() => setOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <span className="text-base">🔐</span>
                      <span>Privacy & Security</span>
                    </Link>
                    <Link
                      href="/dashboard/profile/support"
                      onClick={() => setOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <span className="text-base">❓</span>
                      <span>Help & Support</span>
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false)
                        window.open('/policy', '_blank')
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <span className="text-base">📜</span>
                      <span>Policy</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[var(--border-subtle)] pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 rounded-lg flex items-center gap-3 transition-colors"
                    >
                      <span className="text-base">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
