import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ExternalLink, Globe,
  Code2, BookOpen, Users, Star, Mail,
  Rss, Github, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useState } from 'react'
import { useOrganization } from '../hooks/useOrganizations'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const catColors = ['#FF6B35','#4F46E5','#059669','#DC2626','#7C3AED','#0891B2','#B45309','#BE185D']

function catColor(name = '') {
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return catColors[hue % catColors.length]
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="py-9" style={{ borderTop: '1px solid #F0F0F0' }}>
      <div className="flex items-center gap-2.5 mb-6">
        {Icon && <Icon size={17} className="text-gray-400" />}
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </section>
  )
}

// ─── Year accordion ───────────────────────────────────────────────────────────
function YearSection({ yearDoc }) {
  const [open, setOpen] = useState(false)
  const projects = yearDoc.projects || []

  return (
    <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid #E5E7EB' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span
            className="px-3 py-1 rounded text-white font-bold"
            style={{ background: '#1E3A5F', fontSize: 14 }}
          >
            GSoC {yearDoc.year}
          </span>
          <span className="text-base text-gray-500">
            {yearDoc.numProjects || projects.length} project{(yearDoc.numProjects || projects.length) !== 1 ? 's' : ''}
          </span>
        </div>
        {open ? <ChevronUp size={17} className="text-gray-400" /> : <ChevronDown size={17} className="text-gray-400" />}
      </button>

      {open && projects.length > 0 && (
        <div className="divide-y divide-gray-50">
          {projects.map((p, i) => (
            <div key={i} className="px-5 py-5 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="text-base font-semibold text-gray-800 leading-snug">{p.title || '(Untitled)'}</h4>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {p.projectUrl && (
                    <a href={p.projectUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                      <ExternalLink size={13} /> View
                    </a>
                  )}
                  {p.codeUrl && (
                    <a href={p.codeUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                      <Github size={13} /> Code
                    </a>
                  )}
                </div>
              </div>
              {p.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-2.5 line-clamp-3">{p.description}</p>
              )}
              {p.studentName && (
                <p className="text-sm text-gray-400 flex items-center gap-1.5">
                  <Users size={12} /> {p.studentName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {open && projects.length === 0 && (
        <p className="px-5 py-5 text-sm text-gray-400 bg-white">No project details available for this year.</p>
      )}
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-start gap-6 mb-8 pt-6">
        <div className="w-24 h-24 rounded-2xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-7 bg-gray-100 rounded w-1/2" />
          <div className="h-5 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2 mb-6">
        {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-100 rounded w-full" />)}
      </div>
      <div className="flex gap-2 mb-6">
        {[1,2,3,4].map(i => <div key={i} className="h-6 w-16 bg-gray-100 rounded-full" />)}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrganizationDetail() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const { data: org, years, loading, error } = useOrganization(slug)

  // ── Loading ──
  if (loading) {
    return (
      <main className="min-h-screen bg-white" style={{ paddingTop: 'clamp(60px,8vw,80px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pt-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft size={14} /> Back
        </button>
        <DetailSkeleton />
      </div>
    </main>
    )
  }

  // ── Error / not found ──
  if (error || !org) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6" style={{ paddingTop: 80 }}>
        <div className="text-center">
          <p className="font-heading text-7xl font-bold text-gray-900 mb-4" style={{ opacity: 0.07 }}>404</p>
          <p className="font-heading text-xl font-bold text-gray-900 mb-2">Organization not found</p>
          <p className="text-sm text-gray-400 mb-8">{error || 'This organization does not exist in our database.'}</p>
          <Link to="/organizations" className="btn-dark">Back to Organizations</Link>
        </div>
      </main>
    )
  }

  const bg      = catColor(org.category)
  const hue     = (org.name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  const allYears = (years || []).sort((a, b) => b.year - a.year)
  const latestYear = allYears[0]

  return (
    <main className="min-h-screen bg-white" style={{ paddingTop: 'clamp(60px,8vw,80px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pt-6 pb-0">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={14} /> Back to Organizations
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-16">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-14 items-start">

          {/* ── Main column ── */}
          <div>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="pt-8 pb-6"
            >
              {/* Logo + name — flex-col on mobile, row on sm+ */}
              <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
                {/* Logo */}
                <div
                  className="flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{
                    width: 'clamp(80px,18vw,140px)',
                    height: 'clamp(80px,18vw,140px)',
                    background: org.imageBackgroundColor || '#F9FAFB',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  {(org.logoUrl || org.imageUrl) ? (
                    <img
                      src={org.logoUrl || org.imageUrl}
                      alt={org.name}
                      className="w-full h-full object-contain p-2"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full items-center justify-center text-white font-bold text-2xl"
                    style={{
                      display: (org.logoUrl || org.imageUrl) ? 'none' : 'flex',
                      background: `hsl(${hue},50%,48%)`,
                    }}
                  >
                    {(org.name || '?').slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Name + category + years */}
                <div className="flex-1 min-w-0">
                  <h1
                    className="font-heading font-bold text-gray-900 leading-tight mb-3"
                    style={{ fontSize: 'clamp(1.5rem,5vw,2.75rem)', letterSpacing: '-0.02em' }}
                  >
                    {org.name}
                  </h1>

                  {org.category && (
                    <span
                      className="inline-block px-4 py-1.5 rounded text-white font-bold uppercase mb-4"
                      style={{ background: bg, fontSize: 13, letterSpacing: '0.04em' }}
                    >
                      {org.category}
                    </span>
                  )}

                  {/* Participation years */}
                  {allYears.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {allYears.map(y => (
                        <span
                          key={y.year}
                          className="px-3 py-1 rounded text-white font-medium"
                          style={{ background: '#1E3A5F', fontSize: 13 }}
                        >
                          {y.year}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: 17 }}>
                {org.description || org.descriptionShort || ''}
              </p>
            </motion.div>

            {/* Technologies */}
            {org.technologies?.length > 0 && (
              <Section title="Technologies" icon={Code2}>
                <div className="flex flex-wrap gap-3">
                  {org.technologies.map(t => (
                    <span key={t} className="px-4 py-2 rounded-full text-base text-gray-700 bg-gray-100"
                      style={{ border: '1px solid #E5E7EB' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Topics */}
            {org.topics?.length > 0 && (
              <Section title="Topics" icon={BookOpen}>
                <div className="flex flex-wrap gap-3">
                  {org.topics.map(t => (
                    <span key={t} className="px-4 py-2 rounded-full text-base text-indigo-700 bg-indigo-50"
                      style={{ border: '1px solid #C7D2FE' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* GSoC Projects by year */}
            {allYears.length > 0 && (
              <Section title="GSoC Projects by Year" icon={Star}>
                <p className="text-sm text-gray-400 mb-5">
                  Click a year to expand its project list.
                </p>
                {allYears.map(yearDoc => (
                  <YearSection key={yearDoc.year} yearDoc={yearDoc} />
                ))}
              </Section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="lg:sticky lg:top-28 flex flex-col gap-3 pt-4 lg:pt-8"
          >
            {/* Primary CTA */}
            {org.website && (
              <a href={org.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gray-900 text-white
                           text-base font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200">
                Visit Website <ExternalLink size={16} />
              </a>
            )}
            {org.githubUrl && (
              <a href={org.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 text-gray-900
                           text-base font-semibold rounded-xl bg-white hover:bg-gray-50 transition-all duration-200"
                style={{ border: '1px solid #E5E7EB' }}>
                <Github size={16} /> View on GitHub
              </a>
            )}

            {/* Details */}
            <div className="rounded-xl p-6 bg-gray-50 flex flex-col gap-4"
              style={{ border: '1px solid #E5E7EB' }}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Details</h3>

              {org.category && (
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm text-gray-400">Category</span>
                  <span className="text-sm font-medium text-gray-900">{org.category}</span>
                </div>
              )}

              <div className="flex justify-between items-center gap-3">
                <span className="text-sm text-gray-400">GSoC Years</span>
                <span className="text-sm font-medium text-gray-900">{allYears.length}</span>
              </div>

              {latestYear && (
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm text-gray-400">Latest Year</span>
                  <span className="text-sm font-medium text-gray-900">{latestYear.year}</span>
                </div>
              )}

              {latestYear?.numProjects > 0 && (
                <div className="flex justify-between items-center gap-3">
                  <span className="text-sm text-gray-400">Projects ({latestYear.year})</span>
                  <span className="text-sm font-medium text-gray-900">{latestYear.numProjects}</span>
                </div>
              )}

              {org.technologies?.length > 0 && (
                <div className="flex justify-between items-start gap-3">
                  <span className="text-sm text-gray-400 flex-shrink-0">Technologies</span>
                  <span className="text-sm font-medium text-gray-900 text-right">
                    {org.technologies.slice(0, 3).join(', ')}
                    {org.technologies.length > 3 && ` +${org.technologies.length - 3}`}
                  </span>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="rounded-xl p-6 bg-gray-50 flex flex-col gap-4"
              style={{ border: '1px solid #E5E7EB' }}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Links</h3>
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-gray-500 hover:text-gray-900 transition-colors">
                  <Globe size={16} /> Official Website
                </a>
              )}
              {org.githubUrl && (
                <a href={org.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-gray-500 hover:text-gray-900 transition-colors">
                  <Github size={16} /> GitHub
                </a>
              )}
              {org.twitterUrl && (
                <a href={org.twitterUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-gray-500 hover:text-gray-900 transition-colors">
                  <ExternalLink size={16} /> Twitter / X
                </a>
              )}
              {org.blogUrl && (
                <a href={org.blogUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-gray-500 hover:text-gray-900 transition-colors">
                  <Rss size={16} /> Blog
                </a>
              )}
              {org.mailingList && (
                <a href={org.mailingList} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-base text-gray-500 hover:text-gray-900 transition-colors">
                  <Mail size={16} /> Mailing List
                </a>
              )}
              {org.contactEmail && (
                <a href={`mailto:${org.contactEmail}`}
                  className="flex items-center gap-2.5 text-base text-gray-500 hover:text-gray-900 transition-colors">
                  <Mail size={16} /> {org.contactEmail}
                </a>
              )}
            </div>

            <Link to="/organizations"
              className="flex items-center justify-center gap-2 text-base text-gray-400
                         hover:text-gray-900 transition-colors py-3">
              <ArrowLeft size={15} /> All Organizations
            </Link>
          </motion.aside>
        </div>
      </div>
    </main>
  )
}
