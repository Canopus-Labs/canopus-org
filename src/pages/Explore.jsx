import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Building2, CalendarDays } from 'lucide-react'

export default function Explore() {
  return (
    <main className="min-h-screen" style={{ background: 'transparent' }}>

      <div className="relative max-w-5xl mx-auto px-6 md:px-10 text-center" style={{ paddingTop: '140px', paddingBottom: '60px' }}>

        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="section-label mb-8 inline-block"
        >
          Discovery
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-gray-900 leading-none tracking-tight text-balance mb-5"
          style={{ fontSize: '72px', lineHeight: '1.05', fontWeight: 600, letterSpacing: '-0.025em' }}
        >
          Explore Open Source
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto mb-14"
          style={{ fontSize: '18px', lineHeight: '1.5', fontWeight: 400, color: 'rgba(15,15,15,0.52)' }}
        >
          Find organizations and events worth your time.
        </motion.p>

        {/* Two primary cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto text-left"
        >
          {/* Organizations */}
          <Link
            to="/organizations"
            className="group relative rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors duration-200">
              <Building2 size={22} className="text-gray-800" />
            </div>
            <h2 className="font-heading text-gray-900 mb-3 tracking-tight" style={{ fontSize: '18px', lineHeight: '1.5', fontWeight: 600 }}>Organizations</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }} className="text-gray-500 mb-8">
              Discover active open-source organizations, technologies, projects and contribution opportunities.
            </p>
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all duration-200">
              Explore Organizations <ArrowRight size={14} />
            </span>
          </Link>

          {/* Events */}
          <Link
            to="/events"
            className="group relative bg-gray-900 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.10)' }}>
              <CalendarDays size={22} className="text-white" />
            </div>
            <h2 className="font-heading text-white mb-3 tracking-tight" style={{ fontSize: '18px', lineHeight: '1.5', fontWeight: 600 }}>Events</h2>
            <p className="mb-8" style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255,255,255,0.50)' }}>
              Discover open-source programs, mentorships, hackathons and community events.
            </p>
            <span
              className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              Explore Events <ArrowRight size={14} />
            </span>
          </Link>
        </motion.div>

        {/* Quick hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12"
        >
          <p className="text-sm text-gray-400">Not sure where to start?</p>
          <div className="flex gap-3">
            <Link to="/organizations" className="btn-outline text-xs py-2 px-4">
              Browse Organizations <ArrowUpRight size={12} />
            </Link>
            <Link to="/events" className="btn-dark text-xs py-2 px-4">
              Discover Events <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
