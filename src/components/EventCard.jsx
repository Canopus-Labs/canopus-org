import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, DollarSign } from 'lucide-react'
import StatusBadge from './StatusBadge'

function colorFromStr(str = '') {
  const palette = ['#4F46E5','#0891B2','#059669','#D97706','#DC2626','#7C3AED','#0284C7','#BE185D']
  const hue = str.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return palette[hue % palette.length]
}

export default function EventCard({ event, index = 0 }) {
  const [imgError, setImgError] = useState(false)

  const logoSrc  = event.logo ? `/event-logos/${event.logo}` : null
  const initials = (event.name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const accent   = colorFromStr(event.name)

  const formattedDeadline = event.applicationDeadline
    ? (() => {
        try {
          return new Date(event.applicationDeadline).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
          })
        } catch { return event.applicationDeadline }
      })()
    : null

  const isPaid = event.stipend &&
    !event.stipend.toLowerCase().startsWith('unpaid') &&
    !event.stipend.toLowerCase().startsWith('not specified')

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(index * 0.04, 0.3) }}
      className="h-full"
    >
      <Link
        to={`/events/${event.slug}`}
        className="group flex flex-col bg-white h-full rounded-2xl p-5
                   transition-all duration-300
                   hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        style={{ border: '1px solid rgba(0,0,0,0.09)' }}
        aria-label={`View ${event.name}`}
      >
        {/* ── Row 1: Logo + Name + Status ── */}
        <div className="flex items-start gap-3.5 mb-4">

          {/* Logo — 56×56 */}
          <div
            className="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
            style={{
              width: 56, height: 56,
              background: (logoSrc && !imgError) ? '#F9FAFB' : accent,
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            {logoSrc && !imgError ? (
              <img
                src={logoSrc}
                alt={event.name}
                className="w-full h-full object-contain p-1.5"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <span className="font-bold text-white text-base select-none">
                {initials}
              </span>
            )}
          </div>

          {/* Name + organizer + status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="font-heading font-bold text-gray-900 leading-snug line-clamp-2
                           group-hover:text-indigo-600 transition-colors duration-150"
                style={{ fontSize: 15 }}
              >
                {event.name}
              </h3>
              <div className="flex-shrink-0 mt-0.5">
                <StatusBadge status={event.status} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 truncate">{event.organizer}</p>
          </div>
        </div>

        {/* ── Row 2: Type + Scope badges ── */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE' }}
          >
            {event.type}
          </span>
          {event.eventScope && (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}
            >
              {event.eventScope}
            </span>
          )}
        </div>

        {/* ── Row 3: Description ── */}
        <p
          className="text-gray-500 line-clamp-2 mb-4 flex-1"
          style={{ fontSize: 13, lineHeight: 1.55 }}
        >
          {event.shortDescription || event.description || ''}
        </p>

        {/* ── Row 4: Tech tags ── */}
        {event.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.technologies.slice(0, 4).map(t => (
              <span key={t}
                className="px-2 py-0.5 rounded-full text-xs text-gray-600 bg-gray-100"
                style={{ border: '1px solid #E5E7EB' }}>
                {t}
              </span>
            ))}
            {event.technologies.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-xs text-gray-400"
                style={{ border: '1px solid #E5E7EB' }}>
                +{event.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* ── Row 5: Footer — deadline + paid + view arrow ── */}
        <div className="flex items-center justify-between pt-4 mt-auto"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            {formattedDeadline && event.status !== 'completed' && (
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {formattedDeadline}
              </span>
            )}
            {isPaid ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <DollarSign size={11} /> Paid
              </span>
            ) : event.stipend?.toLowerCase().startsWith('unpaid') ? (
              <span className="text-gray-400">Unpaid</span>
            ) : null}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-900
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
