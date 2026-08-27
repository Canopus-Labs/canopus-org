import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'
import EventCard from '../components/EventCard'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { events, allEventTypes, allEventScopes, allEventStatuses } from '../data/eventsData'

const PAGE_SIZE = 18

// ─── Sidebar filter section ───────────────────────────────────────────────────
function FilterSection({ title, items, selected, onToggle }) {
  const [open, setOpen] = useState(true)
  const [localSearch, setLocalSearch] = useState('')

  const filtered = useMemo(() =>
    localSearch.trim()
      ? items.filter(i => i.toLowerCase().includes(localSearch.toLowerCase()))
      : items,
    [items, localSearch]
  )

  return (
    <div className="mb-5" style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: 16 }}>
      <button
        className="flex items-center justify-between w-full mb-3"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-heading font-bold text-gray-800" style={{ fontSize: 15 }}>{title}</span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>

      {open && (
        <>
          {items.length > 6 && (
            <div className="relative mb-2.5">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}…`}
                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-gray-50 text-gray-700
                           placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                style={{ border: '1px solid #E5E7EB', fontSize: 13 }}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            {filtered.map(item => (
              <label key={item}
                className="flex items-center gap-2.5 px-1 py-1.5 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => onToggle(item)}
                  className="w-4 h-4 rounded accent-indigo-600 flex-shrink-0 cursor-pointer"
                />
                <span className="text-gray-600 truncate" style={{ fontSize: 13 }}>{item}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Status pill filter ────────────────────────────────────────────────────────
const statusConfig = {
  'ongoing':           { label: 'Ongoing',           bg: '#DCFCE7', color: '#15803D' },
  'applications-open': { label: 'Applications Open', bg: '#DBEAFE', color: '#1D4ED8' },
  'upcoming':          { label: 'Upcoming',          bg: '#FEF9C3', color: '#A16207' },
  'completed':         { label: 'Completed',         bg: '#F3F4F6', color: '#6B7280' },
}

// ─── Active filter pills ──────────────────────────────────────────────────────
function ActiveFilters({ types, scopes, statuses, search, onClear }) {
  const all = [
    ...types.map(v => ({ label: v, type: 'type' })),
    ...scopes.map(v => ({ label: v, type: 'scope' })),
    ...statuses.map(v => ({ label: statusConfig[v]?.label || v, type: 'status', raw: v })),
    ...(search ? [{ label: `"${search}"`, type: 'search' }] : []),
  ]
  if (!all.length) return null
  return (
    <div className="flex flex-wrap gap-1.5 mb-5">
      {all.map(({ label, type, raw }) => (
        <span key={`${type}-${label}`}
          className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-indigo-50 text-indigo-700"
          style={{ fontSize: 11, border: '1px solid #C7D2FE' }}>
          {label}
          <button onClick={() => onClear(type, raw || label)}
            className="hover:bg-indigo-100 rounded-full p-0.5 transition-colors">
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Events() {
  const [search,       setSearch]       = useState('')
  const [typeFilters,  setTypeFilters]  = useState([])
  const [scopeFilters, setScopeFilters] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [page,         setPage]         = useState(1)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  const resetPage = () => setPage(1)

  const toggle = (setter) => (val) => {
    setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
    resetPage()
  }

  const clearFilter = (type, val) => {
    if (type === 'type')   setTypeFilters(p => p.filter(x => x !== val))
    if (type === 'scope')  setScopeFilters(p => p.filter(x => x !== val))
    if (type === 'status') setStatusFilter(p => p.filter(x => x !== val))
    if (type === 'search') setSearch('')
    resetPage()
  }

  const clearAll = () => {
    setSearch(''); setTypeFilters([]); setScopeFilters([]); setStatusFilter([]); setPage(1)
  }

  // Filter data
  const filtered = useMemo(() => {
    return events.filter(event => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        event.name.toLowerCase().includes(q) ||
        event.organizer?.toLowerCase().includes(q) ||
        event.shortDescription?.toLowerCase().includes(q) ||
        event.type?.toLowerCase().includes(q) ||
        event.technologies?.some(t => t.toLowerCase().includes(q)) ||
        event.tags?.some(t => t.toLowerCase().includes(q))

      const matchType   = !typeFilters.length  || typeFilters.includes(event.type)
      const matchScope  = !scopeFilters.length || scopeFilters.includes(event.eventScope)
      const matchStatus = !statusFilter.length || statusFilter.includes(event.status)

      return matchSearch && matchType && matchScope && matchStatus
    })
  }, [search, typeFilters, scopeFilters, statusFilter])

  // Pagination
  const paged    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  // Distinct type/scope lists
  const typeList  = allEventTypes.filter(t => t !== 'All')
  const scopeList = allEventScopes.filter(s => s !== 'All')

  const activeCount = typeFilters.length + scopeFilters.length + statusFilter.length + (search ? 1 : 0)

  const SidebarContent = () => (
    <aside style={{ width: '100%', maxWidth: 260 }}>
      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={e => { setSearch(e.target.value); resetPage() }}
          placeholder="Search events…"
          className="w-full pl-9 pr-3 py-3 rounded-xl bg-white text-gray-800
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          style={{ border: '1px solid #E5E7EB', fontSize: 14 }}
        />
      </div>

      {/* Clear all */}
      {activeCount > 0 && (
        <button onClick={clearAll}
          className="flex items-center gap-1.5 mb-5 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          style={{ fontSize: 13 }}>
          <X size={13} /> Clear all ({activeCount})
        </button>
      )}

      {/* Status filter — pill buttons */}
      <div className="mb-5" style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: 16 }}>
        <p className="font-heading font-bold text-gray-800 mb-3" style={{ fontSize: 15 }}>Status</p>
        <div className="flex flex-col gap-1.5">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const active = statusFilter.includes(key)
            return (
              <button key={key}
                onClick={() => { toggle(setStatusFilter)(key); resetPage() }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150"
                style={{
                  background: active ? cfg.bg : 'transparent',
                  border: active ? `1px solid ${cfg.color}40` : '1px solid transparent',
                  fontSize: 13,
                  color: active ? cfg.color : '#6B7280',
                }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: cfg.color }} />
                {cfg.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Type filter */}
      <FilterSection
        title="Event Type"
        items={typeList}
        selected={typeFilters}
        onToggle={toggle(setTypeFilters)}
      />

      {/* Scope filter */}
      <FilterSection
        title="Scope"
        items={scopeList}
        selected={scopeFilters}
        onToggle={toggle(setScopeFilters)}
      />
    </aside>
  )

  return (
    <main className="min-h-screen" style={{ background: '#FFFFFF' }}>

      {/* Header */}
      <div style={{ paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 24 }}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
          <h1 className="font-heading font-bold text-gray-900 mb-2 page-title">
            Open Source Events
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Find mentorships, programs, hackathons and events that can kickstart your open-source journey.
          </p>
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="md:hidden max-w-screen-2xl mx-auto px-4 sm:px-6 mb-4">
        <button onClick={() => setMobileOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium">
          Filters {activeCount > 0 && `(${activeCount})`}
          {mobileOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {mobileOpen && (
          <div className="mt-4 p-4 rounded-2xl bg-white" style={{ border: '1px solid #E5E7EB' }}>
            <SidebarContent />
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-16">
        <div className="flex gap-6 lg:gap-8 items-start">

          {/* Sidebar — desktop */}
          <div className="hidden md:block sticky top-24 self-start no-scrollbar"
            style={{ width: 260, minWidth: 260 }}>
            <SidebarContent />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">

            <ActiveFilters
              types={typeFilters}
              scopes={scopeFilters}
              statuses={statusFilter}
              search={search}
              onClear={clearFilter}
            />

            {/* Count */}
            <motion.p
              key={filtered.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-400 mb-6"
            >
              {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
            </motion.p>

            {/* Empty */}
            {paged.length === 0 && (
              <EmptyState
                title="No events found"
                subtitle="Try different filters or clear your selection."
                onReset={clearAll}
              />
            )}

            {/* Grid */}
            {paged.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paged.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-10 pt-6"
                style={{ borderTop: '1px solid #F0F0F0' }}>
                <p className="text-sm text-gray-400">
                  Page {page} of {totalPages} · {filtered.length} events
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    style={{ border: '1px solid #E5E7EB' }}>
                    Previous
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    style={{ border: '1px solid #E5E7EB' }}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
