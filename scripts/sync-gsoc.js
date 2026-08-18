/**
 * scripts/sync-gsoc.js
 *
 * GSoC Organizations data ingestion — one MongoDB document per (org, year).
 *
 * API endpoints:
 *   All years:  https://api.gsocorganizations.dev/organizations.json
 *   One year:   https://api.gsocorganizations.dev/2025.json
 *
 * Usage:
 *   npm.cmd run sync:gsoc                   — sync all years (2016-2026)
 *   npm.cmd run sync:gsoc -- --year 2025    — sync one year only
 *   npm.cmd run sync:gsoc -- --dry-run      — preview without writing
 *   npm.cmd run sync:gsoc -- --drop         — drop collection first, then sync
 *
 * Safe to run multiple times — upsert on (gsocId, year).
 */

import 'dotenv/config'
import { connectDB, disconnectDB } from '../server/db.js'
import OrgYear from '../server/models/Organization.js'

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args       = process.argv.slice(2)
const yearArg    = args.includes('--year') ? args[args.indexOf('--year') + 1] : null
const isDryRun   = args.includes('--dry-run')
const doDrop     = args.includes('--drop')
const targetYear = yearArg ? parseInt(yearArg, 10) : null

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = {
  orgsInResponse: 0,
  docsCreated:    0,
  docsUpdated:    0,
  projectsStored: 0,
  skipped:        0,
  errors:         0,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return (str || '')
    .toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toArray(val) {
  if (!val) return []
  if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean)
  if (typeof val === 'string') return val.split(/[,;|]/).map(v => v.trim()).filter(Boolean)
  return []
}

async function fetchJSON(url) {
  console.log(`\n📡 Fetching: ${url}`)
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'canopus-labs-sync/1.0' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('json')) {
    const text = await res.text()
    throw new Error(`Expected JSON, got ${ct}. Preview: ${text.slice(0, 120)}`)
  }

  const data = await res.json()
  return data
}

// ─── Transform helpers ────────────────────────────────────────────────────────

function transformProject(p) {
  return {
    title:            p.title            || '',
    description:      p.description      || '',
    shortDescription: p.short_description|| '',
    projectUrl:       p.project_url      || '',
    codeUrl:          p.code_url         || '',
    studentName:      p.student_name     || '',
    studentUsername:  p.student_username || p.student_github || '',
    mentors:          toArray(p.mentors  || p.mentor),
    status:           p.status           || '',
  }
}

/**
 * Given a raw org object (from organizations.json) and a specific year,
 * build the OrgYear document for that (org, year) pair.
 */
function buildOrgYearDoc(raw, year) {
  const name   = (raw.name || '').trim()
  const gsocId = slugify(name)
  if (!name || !gsocId) return null

  const yearData    = raw.years?.[String(year)] || {}
  const rawProjects = Array.isArray(yearData.projects) ? yearData.projects : []
  const projects    = rawProjects.map(transformProject)

  return {
    gsocId,
    year,
    name,
    slug:             gsocId,
    description:      raw.description      || '',
    descriptionShort: raw.tagline          || '',
    website:          raw.url              || '',
    contactEmail:     raw.contact_email    || '',
    mailingList:      raw.mailing_list     || '',
    blogUrl:          raw.blog_url         || '',
    twitterUrl:       raw.twitter_url      || '',
    githubUrl:        raw.github_url       || '',
    logoUrl:          raw.image_url        || '',
    imageUrl:         raw.image_url        || '',
    imageBackgroundColor: raw.image_background_color || '',
    category:         raw.category         || '',
    topics:           toArray(raw.topics),
    technologies:     toArray(raw.technologies),
    ideas:            raw.ideas_list       || '',
    numProjects:      yearData.num_projects ?? rawProjects.length,
    projectsUrl:      yearData.projects_url || '',
    projects,
    lastSyncedAt:     new Date(),
  }
}

// ─── Upsert one (org, year) document ─────────────────────────────────────────

async function upsertOrgYear(doc) {
  try {
    const result = await OrgYear.updateOne(
      { gsocId: doc.gsocId, year: doc.year },
      { $set: doc },
      { upsert: true }
    )
    if (result.upsertedCount > 0) stats.docsCreated++
    else                           stats.docsUpdated++
    stats.projectsStored += doc.projects.length
  } catch (err) {
    if (err.code === 11000) { stats.docsUpdated++; return }
    console.error(`\n  ✗ Error on "${doc.name}" (${doc.year}): ${err.message}`)
    stats.errors++
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════╗')
  console.log('║   Canopus Labs — GSoC Organizations Sync         ║')
  console.log('║   Schema: one document per (organization, year)  ║')
  console.log('╚══════════════════════════════════════════════════╝')

  if (targetYear) console.log(`\n🎯 Target year : ${targetYear}`)
  if (isDryRun)   console.log('⚠️  DRY RUN — no DB writes')
  if (doDrop)     console.log('🗑️  Will DROP the gsoc_orgs collection before syncing')

  // 1. Fetch raw orgs from API
  const url  = targetYear
    ? `https://api.gsocorganizations.dev/${targetYear}.json`
    : 'https://api.gsocorganizations.dev/organizations.json'

  let rawOrgs
  try {
    const data = await fetchJSON(url)
    rawOrgs = Array.isArray(data)
      ? data
      : Array.isArray(data.organizations)
        ? data.organizations
        : Object.values(data)

    if (!rawOrgs.length) throw new Error('API returned 0 organizations')
    console.log(`   ✓ Received ${rawOrgs.length} organizations`)
    stats.orgsInResponse = rawOrgs.length
  } catch (err) {
    console.error(`\n❌ Fetch failed: ${err.message}`)
    process.exit(1)
  }

  // 2. Figure out which years to process
  // If organizations.json is fetched, each org has a `years` object with
  // year keys like "2016", "2017", ..., "2026".
  // Collect all distinct years across all orgs.
  let yearsToProcess

  if (targetYear) {
    yearsToProcess = [targetYear]
  } else {
    const yearSet = new Set()
    rawOrgs.forEach(org => {
      if (org.years && typeof org.years === 'object') {
        Object.keys(org.years).forEach(y => {
          const n = parseInt(y, 10)
          if (Number.isFinite(n)) yearSet.add(n)
        })
      }
    })
    yearsToProcess = [...yearSet].sort()
  }

  console.log(`   ✓ Years to process: ${yearsToProcess.join(', ')}`)

  // 3. Dry-run preview
  if (isDryRun) {
    console.log('\n📋 Preview — first 3 orgs × first 2 years:')
    rawOrgs.slice(0, 3).forEach(org => {
      yearsToProcess.slice(0, 2).forEach(yr => {
        const doc = buildOrgYearDoc(org, yr)
        if (doc) {
          console.log(`  "${doc.name}" (${doc.year}) — ${doc.projects.length} projects, techs: ${doc.technologies.slice(0,3).join(', ')}`)
        }
      })
    })
    console.log(`\nTotal documents that would be created: ~${rawOrgs.length * yearsToProcess.length}`)
    console.log('(Remove --dry-run to sync for real)')
    return
  }

  // 4. Connect to MongoDB
  await connectDB()

  // 5. Optionally drop the collection (clean slate)
  if (doDrop) {
    await OrgYear.collection.drop().catch(() => {})
    console.log('🗑️  Dropped gsoc_orgs collection')
  }

  // 6. Build all (org, year) pairs and upsert in batches
  const allDocs = []
  rawOrgs.forEach(org => {
    yearsToProcess.forEach(yr => {
      // Only include this year if the org actually participated in it
      if (!targetYear && org.years && !org.years[String(yr)]) return
      const doc = buildOrgYearDoc(org, yr)
      if (doc) allDocs.push(doc)
      else stats.skipped++
    })
  })

  console.log(`\n   ✓ Built ${allDocs.length} (org, year) documents to upsert`)

  const BATCH = 100
  let done = 0
  for (let i = 0; i < allDocs.length; i += BATCH) {
    await Promise.all(allDocs.slice(i, i + BATCH).map(upsertOrgYear))
    done += Math.min(BATCH, allDocs.length - i)
    process.stdout.write(`\r   Upserting: ${done}/${allDocs.length}`)
  }

  console.log('\n')

  // 7. Print summary
  console.log('──────────────────────────────────────────────────')
  console.log('✅  Sync complete!')
  console.log(`   Orgs in API response  : ${stats.orgsInResponse}`)
  console.log(`   Years processed       : ${yearsToProcess.join(', ')}`)
  console.log(`   Documents created     : ${stats.docsCreated}`)
  console.log(`   Documents updated     : ${stats.docsUpdated}`)
  console.log(`   Projects stored       : ${stats.projectsStored}`)
  console.log(`   Skipped (no name)     : ${stats.skipped}`)
  console.log(`   Errors                : ${stats.errors}`)
  console.log('──────────────────────────────────────────────────')
  console.log(`\nℹ️  Collection: canopus_labs.gsoc_orgs`)
  console.log(`   Each document = one organization × one year`)

  await disconnectDB()
}

main().catch(err => {
  console.error('\n💥 Fatal:', err.message)
  process.exit(1)
})
