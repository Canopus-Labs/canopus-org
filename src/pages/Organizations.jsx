/**
 * src/pages/Organizations.jsx
 *
 * Organization discovery page — improved search & filtering.
 *
 * Key improvements vs previous version:
 *   - Search is debounced inside useOrganizations (350ms) — no keystroke spam
 *   - Autocomplete suggestions dropdown under the search input
 *   - Multi-select filters are ALL sent to the backend (comma-separated arrays)
 *   - No client-side secondary filtering — pagination is always accurate
 *   - Filter counts shown in sidebar from /meta
 *   - Proper empty states with "did you mean" guidance
 *   - isTyping indicator shows instantly while debounce waits
 *   - Page resets to 1 whenever search/filters change
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  AlertCircle, RefreshCw, ArrowUpRight,
  ChevronLeft, ChevronRight, Search,
  ChevronDown, ChevronUp, X, Loader2,
} from 'lucide-react'
import EmptyState  from '../components/EmptyState'
import {
  useOrganizations,
  useOrganizationMeta,
  useOrganizationSuggest,
} from '../hooks/useOrganizations'

const PAGE_SIZE = 24

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white animate-pulse" style={{ border: '1px solid #E5E7EB', borderRadius: 12 }}>
      <div style={{ height: 180, background: '#F9FAFB', borderRadius: '11px 11px 0 0', borderBottom: '1px solid #F0F0F0' }}>
        <div className="w-28 h-20 rounded-lg bg-gray-200 mx-auto mt-8" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-100 rounded w-3/4 mx-auto" />
        <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto" />
        <div className="h-3.5 bg-gray-100 rounded w-full" />
        <div className="h-3.5 bg-gray-100 rounded w-5/6" />
        <div className="flex gap-1.5 justify-center flex-wrap pt-1">
          {[1,2,3].map(i => <div key={i} className="h-6 w-14 bg-gray-100 rounded-full" />)}
        </div>
      </div>
    </div>
  )
}

// ─── Org card ────────────────────────────────────────────────────────────────
function OrgCard({ org, index }) {
  const year = org.year || (org.participationYears?.length ? Math.max(...org.participationYears) : null)
  const hue  = (org.name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360

  const allYears = org.participationYears?.length
    ? [...org.participationYears].sort((a, b) => b - a)
    : year ? [year] : []

  const catColors = ['#FF6B35','#4F46E5','#059669','#DC2626','#7C3AED','#0891B2','#B45309','#BE185D']
  const catBg = catColors[hue % catColors.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(index * 0.03, 0.3) }}
      className="h-full"
    >
      <Link
        to={`/organizations/${org.gsocId || org._id}`}
        className="group flex flex-col bg-white h-full transition-all duration-300
                   hover:shadow-[0_8px_28px_rgba(0,0,0,0.11)] hover:-translate-y-0.5
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        style={{ border: '1px solid #E5E7EB', borderRadius: 12 }}
        aria-label={`View ${org.name}`}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-center w-full overflow-hidden flex-shrink-0"
          style={{
            height: 180,
            background: (org.imageBackgroundColor && org.imageBackgroundColor !== '#ffffff' && org.imageBackgroundColor !== '#fff')
              ? org.imageBackgroundColor : '#F9FAFB',
            borderRadius: '11px 11px 0 0',
            borderBottom: '1px solid #F0F0F0',
          }}
        >
          {(org.logoUrl || org.imageUrl) ? (
            <img
              src={org.logoUrl || org.imageUrl}
              alt={org.name}
              className="max-h-28 max-w-[80%] object-contain"
              onError={e => {
                e.currentTarget.style.display = 'none'
                const fb = e.currentTarget.parentNode.querySelector('[data-fallback]')
                if (fb) fb.style.display = 'flex'
              }}
              loading="lazy"
            />
          ) : null}
          <div data-fallback="1"
            className="w-20 h-20 rounded-2xl items-center justify-center text-white font-bold text-2xl"
            style={{ display: (org.logoUrl || org.imageUrl) ? 'none' : 'flex', background: `hsl(${hue},50%,48%)` }}>
            {(org.name || '?').slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
          <h3 className="font-heading font-bold text-gray-900 text-center mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2"
            style={{ fontSize: 16, lineHeight: 1.35 }}>
            {org.name}
          </h3>

          {org.category && (
            <div className="flex justify-center mb-3">
              <span className="px-3 py-1 rounded text-white font-semibold uppercase"
                style={{ background: catBg, fontSize: 11, letterSpacing: '0.04em' }}>
                {org.category}
              </span>
            </div>
          )}

          <p className="text-gray-500 text-center line-clamp-2 mb-3" style={{ fontSize: 13, lineHeight: 1.55 }}>
            {org.descriptionShort || org.description || ''}
          </p>

          {allYears.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mb-3">
              {allYears.slice(0, 7).map(y => (
                <span key={y} className="px-2 py-0.5 rounded font-medium text-white"
                  style={{ background: '#1E3A5F', fontSize: 11 }}>{y}</span>
              ))}
              {allYears.length > 7 && (
                <span className="px-2 py-0.5 rounded text-gray-500 bg-gray-100" style={{ fontSize: 11 }}>
                  +{allYears.length - 7}
                </span>
              )}
            </div>
          )}

          {org.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-auto pt-2">
              {org.technologies.slice(0, 5).map(t => (
                <span key={t} className="px-2.5 py-1 rounded-full text-gray-600 bg-gray-100"
                  style={{ fontSize: 12, border: '1px solid #E5E7EB' }}>{t}</span>
              ))}
              {org.technologies.length > 5 && (
                <span className="px-2.5 py-1 rounded-full text-gray-400"
                  style={{ fontSize: 12, border: '1px solid #E5E7EB' }}>
                  {org.technologies.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null
  const { page, pages, total, limit } = pagination
  return (
    <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid #F0F0F0' }}>
      <p className="text-xs text-gray-400">
        {((page - 1) * limit + 1).toLocaleString()}–{Math.min(page * limit, total).toLocaleString()} of {total.toLocaleString()}
      </p>
      <div className="flex items-center gap-2">
        <button onClick={() => onPage(page - 1)} disabled={!pagination.hasPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          style={{ border: '1px solid #E5E7EB' }} aria-label="Previous page">
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs text-gray-500">{page} / {pages}</span>
        <button onClick={() => onPage(page + 1)} disabled={!pagination.hasNext}
          className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          style={{ border: '1px solid #E5E7EB' }} aria-label="Next page">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Filter section ───────────────────────────────────────────────────────────
function FilterSection({ title, items, selected, onToggle }) {
  const [open,        setOpen]        = useState(true)
  const [localSearch, setLocalSearch] = useState('')
  const [showAll,     setShowAll]     = useState(false)

  // items can be { value, count }[] or string[]
  const normalised = useMemo(() => items.map(i => typeof i === 'string' ? { value: i, count: null } : i), [items])

  const filtered = useMemo(() => {
    if (!localSearch.trim()) return normalised
    return normalised.filter(i => i.value.toLowerCase().includes(localSearch.toLowerCase()))
  }, [normalised, localSearch])

  const visible = showAll ? filtered : filtered.slice(0, 8)

  return (
    <div className="mb-5" style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: 16 }}>
      <button className="flex items-center justify-between w-full mb-3" onClick={() => setOpen(o => !o)}>
        <span className="font-heading font-bold text-gray-800" style={{ fontSize: 15 }}>{title}</span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>

      {open && (
        <>
          {normalised.length > 8 && (
            <div className="relative mb-3">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
              <input type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}…`}
                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                style={{ border: '1px solid #E5E7EB', fontSize: 13 }} />
            </div>
          )}

          <div className="flex flex-col gap-1">
            {visible.map(({ value, count }) => (
              <label key={value}
                className="flex items-center justify-between gap-2 px-1 py-1.5 rounded cursor-pointer hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)}
                    className="w-4 h-4 rounded accent-indigo-600 flex-shrink-0 cursor-pointer" />
                  <span className="text-gray-600 truncate group-hover:text-gray-900 transition-colors" style={{ fontSize: 13 }}>
                    {value}
                  </span>
                </div>
                {count != null && (
                  <span className="text-gray-300 flex-shrink-0" style={{ fontSize: 12 }}>({count})</span>
                )}
              </label>
            ))}
          </div>

          {filtered.length > 8 && (
            <button onClick={() => setShowAll(s => !s)}
              className="mt-2 text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
              style={{ fontSize: 13 }}>
              {showAll ? 'Show less' : `View all (${filtered.length})`}
            </button>
          )}

          {filtered.length === 0 && (
            <p className="text-gray-400 italic" style={{ fontSize: 13 }}>No results</p>
          )}
        </>
      )}
    </div>
  )
}

// ─── Active filter pills ──────────────────────────────────────────────────────
function ActiveFilters({ search, technologies, topics, categories, years, onClear }) {
  const all = [
    ...technologies.map(v => ({ label: v, type: 'tech' })),
    ...topics.map(v => ({ label: v, type: 'topic' })),
    ...categories.map(v => ({ label: v, type: 'cat' })),
    ...years.map(v => ({ label: v, type: 'year' })),
    ...(search ? [{ label: `"${search}"`, type: 'search' }] : []),
  ]
  if (!all.length) return null

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {all.map(({ label, type }) => (
        <span key={`${type}-${label}`}
          className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-indigo-50 text-indigo-700"
          style={{ fontSize: 11, border: '1px solid #C7D2FE' }}>
          {label}
          <button onClick={() => onClear(type, label)}
            className="hover:bg-indigo-100 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${label} filter`}>
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
  )
}

// ─── Search box with autocomplete suggestions ─────────────────────────────────
function SearchBox({ value, onChange, onSelectSuggestion }) {
  const [focused, setFocused] = useState(false)
  const wrapperRef = useRef(null)
  const { suggestions } = useOrganizationSuggest(value)

  const showSuggestions = focused && value.trim().length >= 2 && suggestions.length > 0

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative mb-6" ref={wrapperRef}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ zIndex: 1 }} />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Search organizations…"
        className="w-full pl-9 pr-3 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-300"
        style={{ border: '1px solid #E5E7EB', fontSize: 14 }}
        aria-label="Search organizations"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
      />

      {/* Autocomplete dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl overflow-hidden z-50"
            style={{ border: '1px solid #E5E7EB', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
          >
            {suggestions.map(s => (
              <li key={s.gsocId || s.name} role="option">
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault() // prevent input blur
                    onSelectSuggestion(s.name)
                    setFocused(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <Search size={13} className="text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-800 truncate flex-1">{s.name}</span>
                  {s.category && (
                    <span className="text-xs text-gray-400 flex-shrink-0">{s.category}</span>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Organizations() {
  const [search,       setSearch]       = useState('')
  const [techFilters,  setTechFilters]  = useState([])
  const [topicFilters, setTopicFilters] = useState([])
  const [catFilters,   setCatFilters]   = useState([])
  const [yearFilters,  setYearFilters]  = useState([])
  const [page,         setPage]         = useState(1)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  // Reset to page 1 whenever any filter/search changes
  const resetPage = useCallback(() => setPage(1), [])

  const handleSearchChange = useCallback((v) => { setSearch(v); resetPage() }, [resetPage])

  const toggleFilter = useCallback((setter) => (val) => {
    setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
    resetPage()
  }, [resetPage])

  const clearFilter = useCallback((type, val) => {
    if (type === 'tech')   setTechFilters(p => p.filter(x => x !== val))
    if (type === 'topic')  setTopicFilters(p => p.filter(x => x !== val))
    if (type === 'cat')    setCatFilters(p => p.filter(x => x !== val))
    if (type === 'year')   setYearFilters(p => p.filter(x => x !== val))
    if (type === 'search') setSearch('')
    resetPage()
  }, [resetPage])

  const clearAll = useCallback(() => {
    setSearch(''); setTechFilters([]); setTopicFilters([])
    setCatFilters([]); setYearFilters([]); setPage(1)
  }, [])

  // ── All filters go to server — no client-side secondary filtering ──────────
  const { data: orgs, pagination, loading, isTyping, error, refetch } = useOrganizations({
    search,
    categories:   catFilters,
    technologies: techFilters,
    topics:       topicFilters,
    years:        yearFilters,
    page,
    limit: PAGE_SIZE,
  })

  // ── Meta for sidebar filter options (with counts) ──────────────────────────
  const { meta } = useOrganizationMeta()

  const activeFilterCount =
    techFilters.length + topicFilters.length + catFilters.length + yearFilters.length + (search ? 1 : 0)

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div style={{ width: 280 }}>
      {/* Search with autocomplete */}
      <SearchBox
        value={search}
        onChange={handleSearchChange}
        onSelectSuggestion={name => { setSearch(name); resetPage() }}
      />

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <button onClick={clearAll}
          className="flex items-center gap-1.5 mb-5 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          style={{ fontSize: 13 }}>
          <X size={13} /> Clear all filters ({activeFilterCount})
        </button>
      )}

      {meta.categories.length > 0 && (
        <FilterSection title="Categories" items={meta.categories}
          selected={catFilters} onToggle={toggleFilter(setCatFilters)} />
      )}
      {meta.technologies.length > 0 && (
        <FilterSection title="Technologies" items={meta.technologies}
          selected={techFilters} onToggle={toggleFilter(setTechFilters)} />
      )}
      {meta.topics.length > 0 && (
        <FilterSection title="Topics" items={meta.topics}
          selected={topicFilters} onToggle={toggleFilter(setTopicFilters)} />
      )}
      {meta.years.length > 0 && (
        <FilterSection
          title="Years"
          items={meta.years.map(y => typeof y === 'object' ? { value: String(y.value), count: y.count } : { value: String(y), count: null })}
          selected={yearFilters}
          onToggle={toggleFilter(setYearFilters)}
        />
      )}
    </div>
  )

  const showLoading = loading || isTyping

  return (
    <main className="min-h-screen" style={{ background: '#FFFFFF' }}>

      {/* Header */}
      <div style={{ paddingTop: 120, paddingBottom: 32, background: '#fff' }}>
        <div className="max-w-screen-2xl mx-auto px-8 md:px-14">
          <h1 className="font-heading font-bold text-gray-900 mb-2" style={{ fontSize: 42, letterSpacing: '-0.02em' }}>
            Organizations
          </h1>
          <p className="text-gray-500" style={{ fontSize: 16 }}>
            Discover open-source organizations participating in Google Summer of Code.
          </p>
        </div>
      </div>

      {/* Mobile filter toggle */}
      <div className="md:hidden max-w-screen-2xl mx-auto px-8 mb-4">
        <button onClick={() => setMobileOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium">
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          {mobileOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {mobileOpen && (
          <div className="mt-4 p-4 rounded-2xl bg-white" style={{ border: '1px solid #E5E7EB' }}>
            <SidebarContent />
          </div>
        )}
      </div>

      {/* Main: sidebar + grid */}
      <div className="max-w-screen-2xl mx-auto px-8 md:px-14 pb-24">
        <div className="flex gap-8 items-start">

          {/* Sidebar — desktop */}
          <div className="hidden md:block sticky top-24 self-start no-scrollbar" style={{ width: 280, minWidth: 280 }}>
            <SidebarContent />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">

            {/* Active filter pills */}
            <ActiveFilters
              search={search}
              technologies={techFilters}
              topics={topicFilters}
              categories={catFilters}
              years={yearFilters}
              onClear={clearFilter}
            />

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-2xl mb-6"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">Could not load organizations</p>
                  <p className="text-xs text-red-700 mt-0.5">
                    {error}. Make sure the backend server is running on port 3001.
                  </p>
                </div>
                <button onClick={refetch}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors flex-shrink-0">
                  <RefreshCw size={12} /> Retry
                </button>
              </motion.div>
            )}

            {/* Result count + typing indicator */}
            <div className="flex items-center gap-2 mb-5 min-h-[20px]">
              {!error && (
                <>
                  {isTyping ? (
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Loader2 size={11} className="animate-spin" /> Searching…
                    </span>
                  ) : !loading && (
                    <p className="text-xs text-gray-400">
                      {(pagination?.total ?? orgs.length).toLocaleString()} organization
                      {(pagination?.total ?? orgs.length) !== 1 ? 's' : ''} found
                      {search && <span className="text-gray-300"> for "{search}"</span>}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Skeletons while loading */}
            {showLoading && (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!showLoading && !error && orgs.length === 0 && (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5"
                  style={{ border: '1px solid #E5E7EB' }}>
                  <Search size={22} className="text-gray-400" />
                </div>
                <p className="font-heading font-bold text-gray-900 mb-2" style={{ fontSize: 18 }}>
                  {search
                    ? `No organizations found for "${search}"`
                    : 'No organizations found'}
                </p>
                <p className="text-gray-400 mb-6" style={{ fontSize: 14 }}>
                  {activeFilterCount > 0
                    ? 'Try removing some filters or using a different search term.'
                    : 'Try a different keyword — e.g. a language, category, or partial name.'}
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll}
                    className="btn-outline text-sm py-2 px-5">
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            {!showLoading && orgs.length > 0 && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {orgs.map((org, i) => (
                    <OrgCard
                      key={`${org._id || org.gsocId}-${org.year}`}
                      org={org}
                      index={i}
                    />
                  ))}
                </div>
                <Pagination pagination={pagination} onPage={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
