/**
 * src/hooks/useOrganizations.js
 *
 * Data-fetching hooks for the Organizations feature.
 *
 * Changes vs previous version:
 *   - useOrganizations: debounced search (350ms), multi-value filter params
 *     (arrays sent as comma-separated strings), AbortController race protection
 *   - useOrganizationMeta: unchanged, runs once, guarded against StrictMode
 *   - useOrganizationSuggest: NEW — lightweight autocomplete suggestions
 *   - useOrganization: unchanged
 */

import { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

// ─── URL builder ─────────────────────────────────────────────────────────────
function buildUrl(path, params = {}) {
  const base    = `${API_BASE}${path}`
  const entries = []

  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue
    // Arrays → comma-separated string
    if (Array.isArray(v)) {
      const filtered = v.filter(x => x && x !== 'All')
      if (filtered.length) entries.push([k, filtered.join(',')])
    } else {
      const s = String(v).trim()
      if (s && s !== 'All') entries.push([k, s])
    }
  }

  if (!entries.length) return base
  const qs = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
  return `${base}?${qs}`
}

// ─── Debounce helper ──────────────────────────────────────────────────────────
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ─── useOrganizations ─────────────────────────────────────────────────────────
/**
 * Fetches paginated org list from /api/organizations.
 *
 * params.search        — raw search string (debounced internally)
 * params.categories    — string[] of selected categories
 * params.technologies  — string[] of selected technologies
 * params.topics        — string[] of selected topics
 * params.years         — string[] of selected years
 * params.page          — page number (1-based)
 * params.limit         — page size (default 24)
 */
export function useOrganizations(params = {}) {
  const [data,       setData]       = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const abortRef = useRef(null)

  // Debounce the search term so we don't fire on every keystroke
  const debouncedSearch = useDebounce(params.search ?? '', 350)

  const fetchData = useCallback(async (p) => {
    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setLoading(true)
    setError(null)

    try {
      const url = buildUrl('/api/organizations', {
        search:     p.search,
        category:   p.categories,
        technology: p.technologies,
        topic:      p.topics,
        year:       p.years,
        page:       p.page,
        limit:      p.limit ?? 24,
      })

      const res = await fetch(url, { signal: ctrl.signal })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server error ${res.status}`)
      }

      const json = await res.json()
      setData(json.data || [])
      setPagination(json.pagination || null)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message || 'Failed to load organizations.')
      setData([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData({
      ...params,
      search: debouncedSearch,
    })
    return () => abortRef.current?.abort()
    // Deliberately listing each dep explicitly so we react to the right changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    // Stringify arrays so useEffect equality check works
    JSON.stringify(params.categories),
    JSON.stringify(params.technologies),
    JSON.stringify(params.topics),
    JSON.stringify(params.years),
    params.page,
    params.limit,
  ])

  return {
    data,
    pagination,
    loading,
    // Show loading state while typing (before debounce fires)
    isTyping: (params.search ?? '') !== debouncedSearch,
    error,
    refetch: () => fetchData({ ...params, search: debouncedSearch }),
  }
}

// ─── useOrganizationMeta ──────────────────────────────────────────────────────
/**
 * Fetches filter metadata (categories, technologies, topics, years) once on mount.
 * Meta now includes counts: [{ value: 'Python', count: 42 }, ...]
 */
export function useOrganizationMeta() {
  const [meta, setMeta] = useState({
    categories:   [],
    technologies: [],
    topics:       [],
    years:        [],
  })
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    fetch(`${API_BASE}/api/organizations/meta`)
      .then(r => {
        if (!r.ok) throw new Error(`meta ${r.status}`)
        return r.json()
      })
      .then(json => {
        // Support both old format (string[]) and new format ({ value, count }[])
        const normalise = (arr) => {
          if (!Array.isArray(arr)) return []
          if (!arr.length) return []
          if (typeof arr[0] === 'string') {
            return arr.map(v => ({ value: v, count: null }))
          }
          return arr
        }
        setMeta({
          categories:   normalise(json.categories),
          technologies: normalise(json.technologies),
          topics:       normalise(json.topics),
          years:        normalise(json.years),
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { meta, loading }
}

// ─── useOrganizationSuggest ───────────────────────────────────────────────────
/**
 * Autocomplete suggestions for the search input.
 * Debounced 250ms. Fires only when query.length >= 2.
 * Returns: [{ name, gsocId, category }]
 */
export function useOrganizationSuggest(query) {
  const [suggestions, setSuggestions] = useState([])
  const [loading,     setLoading]     = useState(false)
  const abortRef = useRef(null)
  const debouncedQuery = useDebounce(query, 250)

  useEffect(() => {
    const q = (debouncedQuery || '').trim()

    if (q.length < 2) {
      setSuggestions([])
      return
    }

    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)

    fetch(`${API_BASE}/api/organizations/suggest?q=${encodeURIComponent(q)}`, {
      signal: ctrl.signal,
    })
      .then(r => r.json())
      .then(json => setSuggestions(json.suggestions || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [debouncedQuery])

  return { suggestions, loading }
}

// ─── useOrganization (single org detail) ─────────────────────────────────────
export function useOrganization(gsocId) {
  const [data,    setData]    = useState(null)
  const [years,   setYears]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!gsocId) return
    setLoading(true)
    setError(null)

    fetch(`${API_BASE}/api/organizations/${encodeURIComponent(gsocId)}`)
      .then(r => {
        if (!r.ok) throw new Error('Organization not found')
        return r.json()
      })
      .then(json => {
        setData(json.data)
        setYears(json.years || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [gsocId])

  return { data, years, loading, error }
}
