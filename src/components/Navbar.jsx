import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Organizations', href: '/organizations' },
  { label: 'Events',        href: '/events'        },
  { label: 'About',         href: '/#about'        },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pillHeight, setPillHeight] = useState(56)   // track pill height for dropdown offset
  const pillRef  = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Measure actual pill height so the dropdown never overlaps it
  useEffect(() => {
    if (pillRef.current) {
      setPillHeight(pillRef.current.offsetHeight)
    }
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
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50 flex justify-center"
        style={{ top: 12, left: 0, right: 0, pointerEvents: 'none' }}
      >
        {/* ── Liquid glass pill ── */}
        <div
          ref={pillRef}
          style={{
            width: 'min(780px, calc(100vw - 24px))',
            pointerEvents: 'auto',
            position: 'relative',
            borderRadius: 100,
            background: scrolled ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.38)',
            backdropFilter:       'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.70)',
            boxShadow: scrolled
              ? '0 2px 0 0 rgba(255,255,255,0.85) inset, 0 -1px 0 0 rgba(255,255,255,0.30) inset, 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)'
              : '0 2px 0 0 rgba(255,255,255,0.75) inset, 0 -1px 0 0 rgba(255,255,255,0.20) inset, 0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
            transition: 'background 0.35s ease, box-shadow 0.35s ease',
          }}
        >
          {/* Top glare */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, borderRadius: 100,
            background: 'linear-gradient(175deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 40%, transparent 65%)',
            pointerEvents: 'none', zIndex: 1,
          }} />

          {/* Content */}
          <div className="relative flex items-center justify-between"
            style={{ padding: '8px 12px', zIndex: 2, gap: 8 }}>

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0 min-w-0"
              aria-label="Canopus Labs home">
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ width: 30, height: 30, borderRadius: 9, overflow: 'hidden',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 2px 6px rgba(0,0,0,0.25)' }}>
                <img src="/logo.png" alt="Canopus Labs" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-bold uppercase tracking-tight xs:block"
                style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', color: '#0F0F0F', whiteSpace: 'nowrap' }}>
                Canopus Labs
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center"
              aria-label="Main navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link key={link.label} to={link.href}
                    className="relative rounded-full transition-all duration-200 whitespace-nowrap"
                    style={{
                      padding: '6px 14px',
                      fontSize: 'clamp(13px, 1.5vw, 15px)',
                      fontWeight: active ? 600 : 500,
                      color:      active ? '#0F0F0F' : 'rgba(15,15,15,0.58)',
                      background: active ? 'rgba(255,255,255,0.70)' : 'transparent',
                      boxShadow:  active ? '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 8px rgba(0,0,0,0.07)' : 'none',
                      border:     active ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
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

            {/* ── CTA + hamburger ── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/explore"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap"
                style={{
                  padding: 'clamp(7px,1.2vw,9px) clamp(14px,2.5vw,20px)',
                  fontSize: 'clamp(12px,1.8vw,14px)',
                  background: '#0F0F0F', color: 'white',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.12) inset, 0 4px 14px rgba(0,0,0,0.22)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  transition: 'background 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2A2A2A'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0F0F0F'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Start Now →
              </Link>

              <button
                onClick={() => setMobileOpen(o => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="md:hidden flex items-center justify-center rounded-full transition-all duration-150 flex-shrink-0"
                style={{
                  width: 36, height: 36,
                  background: 'rgba(255,255,255,0.50)',
                  border: '1px solid rgba(255,255,255,0.70)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.80) inset, 0 2px 6px rgba(0,0,0,0.08)',
                  color: '#0F0F0F',
                }}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile dropdown — offset from actual pill bottom ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6,  scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 md:hidden"
            style={{
              /* 12px (top offset) + pill height + 6px gap */
              top: 12 + pillHeight + 6,
              left: 12, right: 12,
              borderRadius: 18,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter:      'blur(28px) saturate(180%)',
              WebkitBackdropFilter:'blur(28px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.75)',
              boxShadow: '0 2px 0 rgba(255,255,255,0.85) inset, 0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.07)',
              overflow: 'hidden',
            }}
          >
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, borderRadius: 18,
              background: 'linear-gradient(175deg, rgba(255,255,255,0.50) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />

            <nav className="relative p-3 flex flex-col gap-1" style={{ zIndex: 1 }}>
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href}
                  className="rounded-xl transition-all duration-150 block"
                  style={{ padding: '12px 16px', fontSize: 15, fontWeight: 500, color: 'rgba(15,15,15,0.70)' }}
                  onTouchStart={() => {}}  // enable :active on iOS
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#0F0F0F' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(15,15,15,0.70)' }}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-1 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <Link to="/explore"
                  className="flex items-center justify-center gap-2 w-full rounded-full font-semibold"
                  style={{ padding: '12px 0', fontSize: 15, background: '#0F0F0F', color: 'white', marginTop: 4 }}
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
