/**
 * StatusBadge — handles all status values from the updated events data
 * status: 'ongoing' | 'applications-open' | 'upcoming' | 'completed'
 *         | 'active' | 'open' | 'closed'
 */
export default function StatusBadge({ status }) {
  const config = {
    // Active/ongoing
    'active':            { label: 'Active',            bg: '#DCFCE7', color: '#15803D', dot: '#22C55E', pulse: true },
    'ongoing':           { label: 'Ongoing',           bg: '#DCFCE7', color: '#15803D', dot: '#22C55E', pulse: true },
    'open':              { label: 'Open',              bg: '#DCFCE7', color: '#15803D', dot: '#22C55E', pulse: true },
    // Applications open
    'applications-open': { label: 'Applications Open', bg: '#DBEAFE', color: '#1D4ED8', dot: '#3B82F6', pulse: true },
    // Upcoming
    'upcoming':          { label: 'Upcoming',          bg: '#FEF9C3', color: '#A16207', dot: '#EAB308', pulse: false },
    // Completed / closed
    'completed':         { label: 'Completed',         bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF', pulse: false },
    'closed':            { label: 'Closed',            bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF', pulse: false },
  }

  const cfg = config[status] || { label: status || 'Unknown', bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF', pulse: false }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.pulse ? 'animate-pulse' : ''}`}
        style={{ background: cfg.dot }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  )
}
