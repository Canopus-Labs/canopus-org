/**
 * server/routes/organizations.js
 *
 * Collection: gsoc_orgs  (one document per org per year)
 *
 * GET /api/organizations             — paginated list, filterable, searchable
 * GET /api/organizations/meta        — distinct filter values with counts
 * GET /api/organizations/suggest     — lightweight autocomplete suggestions
 * GET /api/organizations/:gsocId     — full org detail (all years)
 *
 * Search strategy (in order of preference):
 *   1. MongoDB Atlas Search ($search aggregation) — fuzzy, relevance-ranked
 *   2. Native $text index fallback                — if Atlas Search unavailable
 *   3. Case-insensitive $regex fallback            — last resort
 *
 * Multi-value filters are fully server-side — no client-side filtering needed.
 */

import { Router } from 'express'
import OrgYear from '../models/Organization.js'

const router = Router()

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_LIMIT         = 100
const DEFAULT_LIMIT     = 24
const MAX_SEARCH_LENGTH = 200
const SUGGEST_LIMIT     = 8

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toInt(v, fallback) {
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : fallback
}

/** Sanitise and clamp a query string value to a safe string */
function sanitiseString(v) {
  if (typeof v !== 'string') return ''
  return v.trim().slice(0, MAX_SEARCH_LENGTH)
}

/** Escape regex special chars */
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Parse comma-separated or array query param → string[] */
function toArray(v) {
  if (!v) return []
  const arr = Array.isArray(v) ? v : String(v).split(',')
  return arr.map(s => s.trim()).filter(Boolean)
}

/**
 * Detect whether Atlas Search is available by attempting a minimal $search
 * aggregation.  Result is cached after the first call.
 */
let _atlasAvailable = null   // null = unknown, true/false = cached
async function isAtlasSearchAvailable() {
  if (_atlasAvailable !== null) return _atlasAvailable
  try {
    await OrgYear.aggregate([
      { $search: { index: 'org_atlas_search', text: { query: 'test', path: 'name' } } },
      { $limit: 1 },
    ])
    _atlasAvailable = true
  } catch {
    _atlasAvailable = false
    console.info('[Search] Atlas Search index "org_atlas_search" not found — using $text fallback.')
  }
  return _atlasAvailable
}

/**
 * Build the list projection (excludes heavy projects array).
 */
const LIST_PROJECTION = {
  gsocId: 1, slug: 1, name: 1, year: 1,
  description: 1, descriptionShort: 1,
  logoUrl: 1, imageUrl: 1, imageBackgroundColor: 1,
  website: 1, category: 1, technologies: 1, topics: 1,
  numProjects: 1, updatedAt: 1,
}

// ─── Atlas Search pipeline builder ───────────────────────────────────────────

/**
 * Build an aggregation pipeline that uses MongoDB Atlas Search.
 * Supports fuzzy matching, multi-field search, relevance scoring,
 * and all filter combinations.
 */
function buildAtlasPipeline({
  searchTerm, categories, technologies, topics, years,
  skip, pageSize,
}) {
  const stages = []

  // ── $search stage ────────────────────────────────────────────────────────
  if (searchTerm) {
    stages.push({
      $search: {
        index: 'org_atlas_search',
        compound: {
          should: [
            // Exact phrase on name — highest boost
            {
              phrase: {
                query: searchTerm,
                path:  'name',
                score: { boost: { value: 10 } },
              },
            },
            // Autocomplete-style prefix on name
            {
              autocomplete: {
                query: searchTerm,
                path:  'name',
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 8 } },
              },
            },
            // Fuzzy full-text on name
            {
              text: {
                query: searchTerm,
                path:  'name',
                fuzzy: { maxEdits: 1, prefixLength: 2 },
                score: { boost: { value: 6 } },
              },
            },
            // Technologies
            {
              text: {
                query: searchTerm,
                path:  'technologies',
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 4 } },
              },
            },
            // Topics
            {
              text: {
                query: searchTerm,
                path:  'topics',
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 3 } },
              },
            },
            // Category
            {
              text: {
                query: searchTerm,
                path:  'category',
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 2 } },
              },
            },
            // Description
            {
              text: {
                query: searchTerm,
                path:  ['description', 'descriptionShort'],
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 1 } },
              },
            },
          ],
          // At least one should clause must match
          minimumShouldMatch: 1,
        },
      },
    })
  }

  // ── Post-search filters ($match) ─────────────────────────────────────────
  const matchStage = {}

  if (years.length)         matchStage.year        = { $in: years.map(Number).filter(Number.isFinite) }
  if (categories.length)    matchStage.category    = { $in: categories }
  if (technologies.length)  matchStage.technologies = { $in: technologies.map(t => new RegExp(`^${escapeRegex(t)}$`, 'i')) }
  if (topics.length)        matchStage.topics      = { $in: topics.map(t => new RegExp(`^${escapeRegex(t)}$`, 'i')) }

  if (Object.keys(matchStage).length) {
    stages.push({ $match: matchStage })
  }

  // ── Count (before skip/limit) ─────────────────────────────────────────────
  // We need a total count — use $facet to get both in one round-trip
  stages.push({
    $facet: {
      metadata: [{ $count: 'total' }],
      data: [
        // Sort: if searching, rely on Atlas score; otherwise year desc then name
        ...(searchTerm ? [{ $sort: { score: { $meta: 'searchScore' }, year: -1, name: 1 } }] : [{ $sort: { year: -1, name: 1 } }]),
        { $skip: skip },
        { $limit: pageSize },
        { $project: { ...LIST_PROJECTION, score: searchTerm ? { $meta: 'searchScore' } : '$$REMOVE' } },
      ],
    },
  })

  return stages
}

// ─── $text fallback pipeline builder ─────────────────────────────────────────

/**
 * Standard MongoDB $text + $match filter — used when Atlas Search is unavailable.
 * Falls back to regex when no text term.
 */
async function runTextFallback({
  searchTerm, categories, technologies, topics, years,
  skip, pageSize,
}) {
  const filter = {}

  if (searchTerm) {
    filter.$text = { $search: searchTerm }
  }

  if (years.length) {
    const numYears = years.map(Number).filter(Number.isFinite)
    if (numYears.length === 1) filter.year = numYears[0]
    else if (numYears.length > 1) filter.year = { $in: numYears }
  }

  if (categories.length) {
    filter.category = categories.length === 1
      ? new RegExp(`^${escapeRegex(categories[0])}$`, 'i')
      : { $in: categories.map(c => new RegExp(`^${escapeRegex(c)}$`, 'i')) }
  }

  if (technologies.length) {
    filter.technologies = {
      $in: technologies.map(t => new RegExp(`^${escapeRegex(t)}$`, 'i')),
    }
  }

  if (topics.length) {
    filter.topics = {
      $in: topics.map(t => new RegExp(`^${escapeRegex(t)}$`, 'i')),
    }
  }

  const sortObj = searchTerm
    ? { score: { $meta: 'textScore' }, year: -1, name: 1 }
    : { year: -1, name: 1 }

  const proj = searchTerm
    ? { ...LIST_PROJECTION, score: { $meta: 'textScore' } }
    : LIST_PROJECTION

  const [data, total] = await Promise.all([
    OrgYear.find(filter, proj).sort(sortObj).skip(skip).limit(pageSize).lean(),
    OrgYear.countDocuments(filter),
  ])

  return { data, total }
}

// ─── GET /api/organizations/meta ─────────────────────────────────────────────
router.get('/meta', async (_req, res) => {
  try {
    // Use aggregation to get counts alongside distinct values
    const [catAgg, techAgg, topicAgg, yearAgg] = await Promise.all([
      OrgYear.aggregate([
        { $match: { category: { $ne: '' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      OrgYear.aggregate([
        { $unwind: '$technologies' },
        { $match: { technologies: { $ne: '' } } },
        { $group: { _id: '$technologies', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      OrgYear.aggregate([
        { $unwind: '$topics' },
        { $match: { topics: { $ne: '' } } },
        { $group: { _id: '$topics', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      OrgYear.aggregate([
        { $group: { _id: '$year', count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ]),
    ])

    res.json({
      categories:   catAgg.map(d  => ({ value: d._id, count: d.count })),
      technologies: techAgg.map(d => ({ value: d._id, count: d.count })),
      topics:       topicAgg.map(d => ({ value: d._id, count: d.count })),
      years:        yearAgg.map(d  => ({ value: d._id, count: d.count })),
    })
  } catch (err) {
    console.error('[GET /meta]', err)
    res.status(500).json({ error: 'Failed to fetch metadata.' })
  }
})

// ─── GET /api/organizations/suggest ──────────────────────────────────────────
/**
 * Lightweight autocomplete — returns at most 8 org name suggestions.
 * Uses Atlas Search autocomplete if available, else case-insensitive regex.
 *
 * GET /api/organizations/suggest?q=pyth
 */
router.get('/suggest', async (req, res) => {
  try {
    const q = sanitiseString(req.query.q)
    if (!q || q.length < 2) return res.json({ suggestions: [] })

    const useAtlas = await isAtlasSearchAvailable()

    let names = []

    if (useAtlas) {
      const results = await OrgYear.aggregate([
        {
          $search: {
            index: 'org_atlas_search',
            compound: {
              should: [
                {
                  autocomplete: {
                    query: q,
                    path:  'name',
                    fuzzy: { maxEdits: 1 },
                    score: { boost: { value: 2 } },
                  },
                },
                {
                  text: {
                    query: q,
                    path:  'name',
                    fuzzy: { maxEdits: 1 },
                  },
                },
              ],
            },
          },
        },
        { $group: { _id: '$name', gsocId: { $first: '$gsocId' }, category: { $first: '$category' } } },
        { $sort: { _id: 1 } },
        { $limit: SUGGEST_LIMIT },
        { $project: { _id: 0, name: '$_id', gsocId: 1, category: 1 } },
      ])
      names = results
    } else {
      // Regex fallback: case-insensitive prefix + contains
      const regex = new RegExp(escapeRegex(q), 'i')
      const results = await OrgYear.aggregate([
        { $match: { name: regex } },
        { $group: { _id: '$name', gsocId: { $first: '$gsocId' }, category: { $first: '$category' } } },
        { $sort: { _id: 1 } },
        { $limit: SUGGEST_LIMIT },
        { $project: { _id: 0, name: '$_id', gsocId: 1, category: 1 } },
      ])
      names = results
    }

    res.json({ suggestions: names })
  } catch (err) {
    console.error('[GET /suggest]', err)
    res.json({ suggestions: [] }) // never 500 for autocomplete
  }
})

// ─── GET /api/organizations ───────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // ── Sanitise & parse params ────────────────────────────────────────────
    const searchTerm    = sanitiseString(req.query.search)
    const categories    = toArray(req.query.category).filter(Boolean)
    const technologies  = toArray(req.query.technology).filter(Boolean)
    const topics        = toArray(req.query.topic).filter(Boolean)
    const years         = toArray(req.query.year).filter(y => y !== 'All')

    const pageNum  = Math.max(1, toInt(req.query.page,  1))
    const pageSize = Math.min(MAX_LIMIT, Math.max(1, toInt(req.query.limit, DEFAULT_LIMIT)))
    const skip     = (pageNum - 1) * pageSize

    // ── Determine search strategy ─────────────────────────────────────────
    const useAtlas = await isAtlasSearchAvailable()

    let data  = []
    let total = 0

    if (useAtlas && searchTerm) {
      // ── Atlas Search path ──────────────────────────────────────────────
      const pipeline = buildAtlasPipeline({
        searchTerm, categories, technologies, topics, years,
        skip, pageSize,
      })

      const [result] = await OrgYear.aggregate(pipeline)
      data  = result?.data    ?? []
      total = result?.metadata?.[0]?.total ?? 0

    } else if (searchTerm) {
      // ── Native $text fallback ──────────────────────────────────────────
      const r = await runTextFallback({
        searchTerm, categories, technologies, topics, years,
        skip, pageSize,
      })
      data  = r.data
      total = r.total

    } else {
      // ── No search term — pure filter/browse ───────────────────────────
      const filter = {}

      if (years.length) {
        const numYears = years.map(Number).filter(Number.isFinite)
        filter.year = numYears.length === 1 ? numYears[0] : { $in: numYears }
      }
      if (categories.length) {
        filter.category = categories.length === 1
          ? new RegExp(`^${escapeRegex(categories[0])}$`, 'i')
          : { $in: categories.map(c => new RegExp(`^${escapeRegex(c)}$`, 'i')) }
      }
      if (technologies.length) {
        filter.technologies = { $in: technologies.map(t => new RegExp(`^${escapeRegex(t)}$`, 'i')) }
      }
      if (topics.length) {
        filter.topics = { $in: topics.map(t => new RegExp(`^${escapeRegex(t)}$`, 'i')) }
      }

      const [docs, count] = await Promise.all([
        OrgYear.find(filter, LIST_PROJECTION).sort({ year: -1, name: 1 }).skip(skip).limit(pageSize).lean(),
        OrgYear.countDocuments(filter),
      ])
      data  = docs
      total = count
    }

    res.json({
      data,
      pagination: {
        total,
        page:    pageNum,
        limit:   pageSize,
        pages:   Math.ceil(total / pageSize) || 0,
        hasNext: pageNum * pageSize < total,
        hasPrev: pageNum > 1,
      },
      meta: {
        searchStrategy: useAtlas && searchTerm ? 'atlas' : searchTerm ? 'text' : 'filter',
      },
    })
  } catch (err) {
    console.error('[GET /organizations]', err)
    res.status(500).json({ error: 'Failed to fetch organizations.' })
  }
})

// ─── GET /api/organizations/:gsocId ──────────────────────────────────────────
router.get('/:gsocId', async (req, res) => {
  try {
    const { gsocId } = req.params
    const { year }   = req.query

    // MongoDB _id shortcut
    if (gsocId.match(/^[a-f\d]{24}$/i)) {
      const doc = await OrgYear.findById(gsocId).lean()
      if (doc) return res.json({ data: doc, years: [doc] })
    }

    const filter = { gsocId: sanitiseString(gsocId) }
    if (year) {
      const y = parseInt(year, 10)
      if (Number.isFinite(y)) filter.year = y
    }

    const docs = await OrgYear.find(filter).sort({ year: -1 }).lean()

    if (!docs.length) {
      return res.status(404).json({ error: 'Organization not found.' })
    }

    res.json({ data: docs[0], years: docs })
  } catch (err) {
    console.error('[GET /organizations/:gsocId]', err)
    res.status(500).json({ error: 'Failed to fetch organization.' })
  }
})

export default router
