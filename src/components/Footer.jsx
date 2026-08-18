import { Link } from 'react-router-dom'
import { Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ padding: '20px 24px 40px', background: 'transparent' }}>
      <div
        className="max-w-5xl mx-auto"
        style={{
          background: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* ── Main content ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-20 px-10 pt-10 pb-8">

          {/* Left — brand */}
          <div className="max-w-xs">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-5 w-fit group">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#0F0F0F' }}
              >
                <img src="/logo.png" alt="Canopus Labs" className="w-full h-full rounded-lg object-contain" />
              </div>
              <span
                className="font-heading font-bold uppercase tracking-tight"
                style={{ fontSize: '15px', color: '#0F0F0F' }}
              >
                CANOPUS LABS
              </span>
            </Link>

            {/* Tagline */}
            <p
              className="mb-7"
              style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(0,0,0,0.48)' }}
            >
              Your gateway to open source. Discover organizations, programs and events worth contributing to.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {[
                {
                  href: 'https://github.com/Canopus-Labs',
                  label: 'GitHub',
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  ),
                },
                {
                  href: 'https://www.linkedin.com/company/canopus-labs/',
                  label: 'LinkedIn',
                  icon: <Linkedin size={15} />,
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    background: '#0F0F0F',
                    color: 'white',
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — two link columns */}
          <div className="flex gap-16">

            {/* Pages */}
            <div>
              <p
                className="mb-5 uppercase tracking-widest"
                style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(0,0,0,0.40)' }}
              >
                Pages
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  { label: 'Home',          href: '/' },
                  { label: 'Organizations', href: '/organizations' },
                  { label: 'Events',        href: '/events' },
                  { label: 'Explore',       href: '/explore' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      style={{ fontSize: '14px', lineHeight: '1.4', color: 'rgba(0,0,0,0.65)' }}
                      className="hover:text-gray-900 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <p
                className="mb-5 uppercase tracking-widest"
                style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(0,0,0,0.40)' }}
              >
                Information
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  { label: 'About',   href: '/#about' },
                  { label: 'GitHub',  href: 'https://github.com/Canopus-Labs',   external: true },
                  { label: 'LinkedIn',href: 'https://www.linkedin.com/company/canopus-labs/', external: true },
                  { label: 'X',       href: 'https://x.com',        external: true },
                ].map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '14px', lineHeight: '1.4', color: 'rgba(0,0,0,0.65)' }}
                        className="hover:text-gray-900 transition-colors duration-150"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        to={href}
                        style={{ fontSize: '14px', lineHeight: '1.4', color: 'rgba(0,0,0,0.65)' }}
                        className="hover:text-gray-900 transition-colors duration-150"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', margin: '0 40px' }} />

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-10 py-5"
        >
          <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.38)' }}>
            © {new Date().getFullYear()} Canopus Labs. Open-source discovery platform.
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.38)' }}>
            Built with ♥ for the open-source community
          </p>
        </div>
      </div>
    </footer>
  )
}
