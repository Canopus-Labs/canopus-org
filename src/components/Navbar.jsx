import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Organizations', href: '/organizations' },
  { label: 'Events',        href: '/events'        },
  { label: 'About',         href: '/#about'        },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isActive = (href) => {
    if (href.startsWith('/#')) return false
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50 flex justify-center"
        style={{ top: 16, left: 0, right: 0, pointerEvents: 'none' }}
      >
        {/* ── Liquid glass pill ── */}
        <div
          style={{
            width: 'min(780px, calc(100vw - 32px))',
            pointerEvents: 'auto',
            position: 'relative',
            borderRadius: 100,

            /* Multi-layer glass background */
            background: scrolled
              ? 'rgba(255,255,255,0.62)'
              : 'rgba(255,255,255,0.38)',

            /* Frosted blur */
            backdropFilter:         'blur(28px) saturate(180%)',
            WebkitBackdropFilter:   'blur(28px) saturate(180%)',

            /* Layered border: bright top highlight + subtle full border */
            border: '1px solid rgba(255,255,255,0.70)',

            /* Shadow stack — depth + ambient glow */
            boxShadow: scrolled
              ? [
                  '0 2px 0 0 rgba(255,255,255,0.85) inset',   /* top inner shine */
                  '0 -1px 0 0 rgba(255,255,255,0.30) inset',  /* bottom inner */
                  '0 8px 32px rgba(0,0,0,0.10)',               /* soft drop */
                  '0 2px 8px rgba(0,0,0,0.06)',                /* tight drop */
                  '0 0 0 1px rgba(0,0,0,0.05)',                /* outline */
                ].join(', ')
              : [
                  '0 2px 0 0 rgba(255,255,255,0.75) inset',
                  '0 -1px 0 0 rgba(255,255,255,0.20) inset',
                  '0 4px 20px rgba(0,0,0,0.06)',
                  '0 1px 4px rgba(0,0,0,0.04)',
                ].join(', '),

            transition: 'background 0.35s ease, box-shadow 0.35s ease, border 0.35s ease',
          }}
        >
          {/* Top glare streak — the signature liquid-glass highlight */}
          <div
            aria-hidden="true"
            style={{
              position:     'absolute',
              inset:        '0',
              borderRadius: 100,
              background:   'linear-gradient(175deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 40%, transparent 65%)',
              pointerEvents:'none',
              zIndex:       1,
            }}
          />

          {/* Pill content */}
          <div
            className="relative flex items-center justify-between gap-4"
            style={{ padding: '10px 14px', zIndex: 2 }}
          >
            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="Canopus Labs home"
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 32, height: 32,
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 2px 6px rgba(0,0,0,0.25)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.06)'
                  e.currentTarget.style.boxShadow = '0 1px 0 rgba(255,255,255,0.15) inset, 0 4px 12px rgba(0,0,0,0.35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 1px 0 rgba(255,255,255,0.15) inset, 0 2px 6px rgba(0,0,0,0.25)'
                }}
              >
                <img src="/logo.png" alt="Canopus Labs" className="w-full h-full object-contain" />
              </div>

              <span
                className="font-heading font-bold uppercase tracking-tight"
                style={{ fontSize: 14, color: '#0F0F0F', letterSpacing: '-0.01em' }}
              >
                Canopus Labs
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="relative rounded-full transition-all duration-200"
                    style={{
                      padding:    '7px 16px',
                      fontSize:   15,
                      fontWeight: active ? 600 : 500,
                      color:      active ? '#0F0F0F' : 'rgba(15,15,15,0.58)',
                      background: active
                        ? 'rgba(255,255,255,0.70)'
                        : 'transparent',
                      boxShadow: active
                        ? '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 8px rgba(0,0,0,0.07)'
                        : 'none',
                      border: active
                        ? '1px solid rgba(0,0,0,0.08)'
                        : '1px solid transparent',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color      = '#0F0F0F'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.45)'
                        e.currentTarget.style.border     = '1px solid rgba(255,255,255,0.60)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color      = 'rgba(15,15,15,0.58)'
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.border     = '1px solid transparent'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* ── CTA + mobile toggle ── */}
            <div className="flex items-center gap-2.5">
              {/* Glass CTA button */}
              <Link
                to="/explore"
                className="hidden sm:inline-flex items-center gap-2 rounded-full font-semibold"
                style={{
                  padding:    '9px 22px',
                  fontSize:   14,
                  background: '#0F0F0F',
                  color:      'white',
                  boxShadow:  '0 1px 0 rgba(255,255,255,0.12) inset, 0 4px 14px rgba(0,0,0,0.22)',
                  border:     '1px solid rgba(255,255,255,0.10)',
                  transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background  = '#2A2A2A'
                  e.currentTarget.style.boxShadow   = '0 1px 0 rgba(255,255,255,0.12) inset, 0 6px 20px rgba(0,0,0,0.30)'
                  e.currentTarget.style.transform   = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background  = '#0F0F0F'
                  e.currentTarget.style.boxShadow   = '0 1px 0 rgba(255,255,255,0.12) inset, 0 4px 14px rgba(0,0,0,0.22)'
                  e.currentTarget.style.transform   = 'translateY(0)'
                }}
              >
                Start Now →
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden flex items-center justify-center rounded-full transition-all duration-150"
                style={{
                  width: 38, height: 38,
                  background: 'rgba(255,255,255,0.50)',
                  border:     '1px solid rgba(255,255,255,0.70)',
                  boxShadow:  '0 1px 0 rgba(255,255,255,0.80) inset, 0 2px 6px rgba(0,0,0,0.08)',
                  color:      '#0F0F0F',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.50)' }}
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -8,  scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 md:hidden"
            style={{
              top: 76, left: 16, right: 16,
              borderRadius: 20,
              background:         'rgba(255,255,255,0.72)',
              backdropFilter:     'blur(28px) saturate(180%)',
              WebkitBackdropFilter:'blur(28px) saturate(180%)',
              border:     '1px solid rgba(255,255,255,0.75)',
              boxShadow: [
                '0 2px 0 rgba(255,255,255,0.85) inset',
                '0 20px 60px rgba(0,0,0,0.12)',
                '0 4px 16px rgba(0,0,0,0.07)',
              ].join(', '),
              overflow: 'hidden',
            }}
          >
            {/* Inner glare */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: 'linear-gradient(175deg, rgba(255,255,255,0.50) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />

            <nav className="relative p-3 flex flex-col gap-1" style={{ zIndex: 1 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="rounded-xl transition-all duration-150"
                  style={{
                    padding:    '13px 16px',
                    fontSize:   15,
                    fontWeight: 500,
                    color:      'rgba(15,15,15,0.70)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.55)'
                    e.currentTarget.style.color      = '#0F0F0F'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color      = 'rgba(15,15,15,0.70)'
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-1 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <Link
                  to="/explore"
                  className="flex items-center justify-center gap-2 w-full rounded-full font-semibold"
                  style={{
                    padding:    '12px 0',
                    fontSize:   15,
                    background: '#0F0F0F',
                    color:      'white',
                    boxShadow:  '0 1px 0 rgba(255,255,255,0.12) inset, 0 4px 14px rgba(0,0,0,0.20)',
                    marginTop:  4,
                  }}
                >
                  Start Now →
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
