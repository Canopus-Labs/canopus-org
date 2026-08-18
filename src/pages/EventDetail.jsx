import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ExternalLink, Globe, Calendar,
  DollarSign, Clock, Users, Tag as TagIcon,
  BookOpen, CheckCircle2, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useState } from 'react'
import { events } from '../data/eventsData'
import StatusBadge from '../components/StatusBadge'

// Deterministic color
function colorFromStr(str = '') {
  const palette = ['#4F46E5','#0891B2','#059669','#D97706','#DC2626','#7C3AED','#0284C7','#BE185D']
  const hue = str.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return palette[hue % palette.length]
}

// Section wrapper
function Section({ title, icon: Icon, children }) {
  return (
    <section className="py-8" style={{ borderTop: '1px solid #F0F0F0' }}>
      <div className="flex items-center gap-2.5 mb-5">
        {Icon && <Icon size={16} className="text-gray-400" />}
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </section>
  )
}

// Date row in the timeline table
function DateRow({ label, date }) {
  const formatted = (() => {
    if (!date) return '—'
    if (date.includes('–') || date.includes('-') && date.length > 12) {
      // Range like "2026-05-01 – 2026-05-24" or plain text
      try {
        const parts = date.split(/\s*[–-]\s*/)
        if (parts.length === 2 && parts[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
          const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          return `${fmt(parts[0])} – ${fmt(parts[1])}`
        }
      } catch { /* fallthrough */ }
      return date
    }
    try {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch { return date }
  })()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5"
      style={{ borderBottom: '1px solid #F9FAFB' }}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{formatted}</span>
    </div>
  )
}

export default function EventDetail() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const event      = events.find(e => e.slug === slug)

  if (!event) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6" style={{ paddingTop: 80 }}>
        <div className="text-center">
          <p className="font-heading text-8xl font-bold text-gray-900 mb-4" style={{ opacity: 0.07 }}>404</p>
          <p className="font-heading text-2xl font-bold text-gray-900 mb-3">Event not found</p>
          <p className="text-sm text-gray-400 mb-8">This event does not exist in our database.</p>
          <Link to="/events" className="btn-dark">Back to Events</Link>
        </div>
      </main>
    )
  }

  const accent  = colorFromStr(event.name)
  const initials = (event.name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const logoSrc  = event.logo ? `/event-logos/${event.logo}` : null
  const [imgError, setImgError] = useState(false)

  const isPaid = event.stipend &&
    !event.stipend.toLowerCase().startsWith('unpaid') &&
    !event.stipend.toLowerCase().startsWith('not specified')

  const formattedDeadline = event.applicationDeadline
    ? (() => {
        try {
          return new Date(event.applicationDeadline).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })
        } catch { return event.applicationDeadline }
      })()
    : null

  return (
    <main className="min-h-screen bg-white" style={{ paddingTop: 80 }}>

      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-8 md:px-14 pt-6 pb-0">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={14} /> Back to Events
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-14 pb-24">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">

          {/* ── Main column ── */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }} className="pt-8 pb-6">

              {/* Logo + name */}
              <div className="flex items-start gap-6 mb-6">
                {/* Logo / initials */}
                <div
                  className="flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{
                    width: 96, height: 96,
                    background: (logoSrc && !imgError) ? '#fff' : accent,
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  {logoSrc && !imgError ? (
                    <img
                      src={logoSrc}
                      alt={event.name}
                      className="w-full h-full object-contain p-2"
                      onError={() => setImgError(true)}
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="font-bold text-white"
                      style={{ fontSize: 28 }}
                    >
                      {initials}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  {/* Type + scope */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE' }}
                    >
                      {event.type}
                    </span>
                    {event.eventScope && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}
                      >
                        {event.eventScope}
                      </span>
                    )}
                    <StatusBadge status={event.status} />
                  </div>

                  <h1
                    className="font-heading font-bold text-gray-900 leading-tight mb-2"
                    style={{ fontSize: 40, letterSpacing: '-0.02em' }}
                  >
                    {event.name}
                  </h1>

                  <p className="text-base text-gray-400">
                    Organized by <span className="text-gray-700 font-medium">{event.organizer}</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: 17, lineHeight: 1.7 }}>
                {event.description}
              </p>
            </motion.div>

            {/* About */}
            {event.about && (
              <Section title="About" icon={BookOpen}>
                <p className="text-gray-600 leading-relaxed" style={{ fontSize: 16, lineHeight: 1.7 }}>
                  {event.about}
                </p>
              </Section>
            )}

            {/* Important dates */}
            {event.importantDates?.length > 0 && (
              <Section title="Important Dates" icon={Calendar}>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                  <div className="px-6 py-1 divide-y divide-gray-50">
                    {event.importantDates.map(({ label, date }) => (
                      <DateRow key={label} label={label} date={date} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-300 mt-3">
                  Dates are subject to change. Verify on the official website before applying.
                </p>
              </Section>
            )}

            {/* Eligibility */}
            {event.eligibility && (
              <Section title="Eligibility" icon={Users}>
                <div className="rounded-2xl px-6 py-5 bg-gray-50" style={{ border: '1px solid #E5E7EB' }}>
                  <p className="text-gray-700 leading-relaxed" style={{ fontSize: 15 }}>
                    {event.eligibility}
                  </p>
                </div>
              </Section>
            )}

            {/* Application process */}
            {event.applicationProcess && (
              <Section title="How to Apply" icon={CheckCircle2}>
                <div className="rounded-2xl px-6 py-5 bg-blue-50" style={{ border: '1px solid #BFDBFE' }}>
                  <p className="text-blue-900 leading-relaxed" style={{ fontSize: 15 }}>
                    {event.applicationProcess}
                  </p>
                </div>
              </Section>
            )}

            {/* Technologies */}
            {event.technologies?.length > 0 && (
              <Section title="Technologies & Domains" icon={TagIcon}>
                <div className="flex flex-wrap gap-2.5">
                  {event.technologies.map(t => (
                    <span key={t}
                      className="px-4 py-2 rounded-full text-base text-gray-700 bg-gray-100"
                      style={{ border: '1px solid #E5E7EB' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Tags */}
            {event.tags?.length > 0 && (
              <Section title="Tags" icon={TagIcon}>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(t => (
                    <span key={t}
                      className="px-3 py-1.5 rounded-full text-sm font-medium text-indigo-700 bg-indigo-50"
                      style={{ border: '1px solid #C7D2FE' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="lg:sticky lg:top-28 flex flex-col gap-4 pt-8"
          >
            {/* Primary CTA */}
            {event.website && (
              <a href={event.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gray-900 text-white
                           text-base font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200">
                Visit Official Website <ExternalLink size={16} />
              </a>
            )}

            <Link to="/events"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-gray-900
                         text-base font-semibold rounded-xl transition-all duration-200"
              style={{ border: '1px solid #E5E7EB' }}>
              <ArrowLeft size={16} /> Back to Events
            </Link>

            {/* Details card */}
            <div className="rounded-2xl p-6 bg-gray-50 flex flex-col gap-4"
              style={{ border: '1px solid #E5E7EB' }}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Details</h3>

              {[
                { label: 'Status',    value: <StatusBadge status={event.status} /> },
                { label: 'Type',      value: <span className="text-sm font-medium text-gray-900">{event.type}</span> },
                event.eventScope && { label: 'Scope',  value: <span className="text-sm font-medium text-gray-900">{event.eventScope}</span> },
                { label: 'Organizer', value: <span className="text-sm font-medium text-gray-900 text-right">{event.organizer}</span> },
                event.programDuration && {
                  label: 'Duration',
                  value: <span className="text-xs font-medium text-gray-900 text-right leading-snug">{event.programDuration}</span>,
                },
                formattedDeadline && {
                  label: 'Deadline',
                  value: <span className="text-sm font-medium text-gray-900">{formattedDeadline}</span>,
                },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-3"
                  style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
                  <span className="text-sm text-gray-400 flex-shrink-0">{label}</span>
                  {value}
                </div>
              ))}
            </div>

            {/* Stipend card */}
            {event.stipend && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: isPaid ? '#F0FDF4' : '#F9FAFB',
                  border: isPaid ? '1px solid #BBF7D0' : '1px solid #E5E7EB',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={16} className={isPaid ? 'text-emerald-600' : 'text-gray-400'} />
                  <h3 className="text-sm font-semibold uppercase tracking-widest"
                    style={{ color: isPaid ? '#15803D' : '#9CA3AF' }}>
                    Stipend / Compensation
                  </h3>
                </div>
                <p className="text-sm leading-relaxed"
                  style={{ color: isPaid ? '#166534' : '#6B7280' }}>
                  {event.stipend}
                </p>
              </div>
            )}

            {/* Links */}
            {event.website && (
              <div className="rounded-2xl p-6 bg-gray-50" style={{ border: '1px solid #E5E7EB' }}>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Links</h3>
                <a href={event.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-gray-500 hover:text-gray-900 transition-colors">
                  <Globe size={16} /> Official Website
                </a>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </main>
  )
}
