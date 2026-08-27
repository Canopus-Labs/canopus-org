import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Footer from '../components/Footer'
import {
  ArrowRight, Building2, CalendarDays,
  Code2, Layers, GitBranch, Terminal,
} from 'lucide-react'
import { organizations } from '../data/organizations'
import { events } from '../data/eventsData'

// ─── Testimonials data ────────────────────────────────────────────────────────
const testimonials = [
  { quote: "Canopus Labs made it incredibly easy to find my first open-source project.", name: "Priya Sharma", role: "Software Engineer, Bangalore" },
  { quote: "The best place to discover open-source opportunities. Event listings saved me hours.", name: "Marcus Chen", role: "CS Student, MIT" },
  { quote: "Found my GSoC organization through Canopus Labs. Life-changing.", name: "Aisha Patel", role: "Open Source Contributor" },
]

// ─── Stats data ───────────────────────────────────────────────────────────────
const stats = [
  { value: '2000+',   label: 'Organizations',    sub: 'across all domains' },
  { value: '30+',   label: 'Events & Programs', sub: 'mentorships & hackathons' },
  { value: '500+',    label: 'Technologies',      sub: 'languages & stacks' },
  { value: '1,000+', label: 'Opportunities',     sub: 'waiting for you' },
]

// ─── Ecosystem pills data ─────────────────────────────────────────────────────
const ecosystemEvents = [
  { id: 'gsoc',           name: 'GSoC',          logo: 'gsoc.png'          },
  { id: 'lfx-mentorship', name: 'LFX Mentorship', logo: 'lfx.jpg'          },
  { id: 'outreachy',      name: 'Outreachy',      logo: 'outreachy.jpg'     },
  { id: 'hacktoberfest',  name: 'Hacktoberfest',  logo: 'hacktoberfest.jpg' },
  { id: 'gssoc',          name: 'GSSoC',          logo: 'gssoc.jpg'         },
  { id: 'mlh-fellowship', name: 'MLH Fellowship', logo: 'mlh.jpg'           },
  { id: 'season-of-kde',  name: 'Season of KDE',  logo: 'kde.jpg'           },
  { id: 'swoc',           name: 'SWoC',           logo: 'swoc.jpg'          },
]

// ─── EcosystemLogo pill ───────────────────────────────────────────────────────
function EcosystemLogo({ name, logo }) {
  const [err, setErr] = useState(false)
  const src = logo ? `/event-logos/${logo}` : null
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const palette = ['#4F46E5','#0891B2','#059669','#D97706','#DC2626','#7C3AED']
  const accent = palette[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length]

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-full select-none"
      style={{
        background: 'rgba(255,255,255,0.70)',
        border: '1px solid rgba(0,0,0,0.07)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        flexShrink: 0,
      }}>
      <div className="flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center"
        style={{ width: 24, height: 24, background: (src && !err) ? '#fff' : accent, border: '1px solid rgba(0,0,0,0.06)' }}>
        {src && !err
          ? <img src={src} alt="" className="w-full h-full object-contain p-0.5" onError={() => setErr(true)} loading="lazy" />
          : <span className="text-white font-bold" style={{ fontSize: 8 }}>{initials}</span>
        }
      </div>
      <span className="font-medium text-gray-700 whitespace-nowrap" style={{ fontSize: 13 }}>{name}</span>
    </div>
  )
}

// ─── Org logos map — module-level so MockupDisplay AND Home() both access it ──
const orgMockLogos = {
  'apache':          '/org-mock-logo/apache.png',
  'cncf':            '/org-mock-logo/ccnf.jpg',
  'linux-foundation':'/org-mock-logo/lfx.jpg',
  'mozilla':         '/org-mock-logo/mozila.jpg',
  'psf':             '/org-mock-logo/python.png',
  'kubernetes':      '/org-mock-logo/kubernetes.jpg',
  'owasp':           '/org-mock-logo/owasp.png',
  'numfocus':        '/org-mock-logo/numfocus.png',
}

// ─── MockupDisplay — mini org/event preview with toggle ───────────────────────
function MockupDisplay() {
  const [tab, setTab] = useState('org')
  const previewOrgs   = organizations.slice(0, 8)
  const previewEvents = events.slice(0, 6)

  const catColors = ['#FF6B35','#4F46E5','#059669','#DC2626','#7C3AED','#0891B2','#B45309','#BE185D']
  function catBg(name = '') {
    return catColors[name.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % catColors.length]
  }

  const sCfg = {
    ongoing:             { label:'Ongoing',           bg:'#DCFCE7', color:'#15803D', dot:'#22C55E' },
    'applications-open': { label:'Applications Open', bg:'#DBEAFE', color:'#1D4ED8', dot:'#3B82F6' },
    upcoming:            { label:'Upcoming',          bg:'#FEF9C3', color:'#A16207', dot:'#EAB308' },
    completed:           { label:'Completed',         bg:'#F3F4F6', color:'#6B7280', dot:'#9CA3AF' },
    active:              { label:'Active',            bg:'#DCFCE7', color:'#15803D', dot:'#22C55E' },
  }

  // Shared search icon SVG
  const SearchIcon = () => (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="#CCC" strokeWidth="1.5"/>
      <path d="M11 11l3 3" stroke="#CCC" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  // ── Org sidebar ────────────────────────────────────────────────────────────
  const OrgSidebar = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white" style={{ border:'1px solid #E5E7EB' }}>
        <SearchIcon />
        <span style={{ fontSize:11, color:'#9CA3AF' }}>Search organizations...</span>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-gray-800" style={{ fontSize:13 }}>Categories</p>
          <svg width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 mb-2" style={{ border:'1px solid #E5E7EB' }}>
          <SearchIcon />
          <span style={{ fontSize:10, color:'#9CA3AF' }}>Search categories...</span>
        </div>
        {['Artificial Intelligence','Data','Development tools','End user applications','Infrastructure and cloud','Media','Operating systems','Other'].map(c => (
          <div key={c} className="flex items-center gap-2 py-0.5">
            <div className="w-3 h-3 rounded flex-shrink-0" style={{ border:'1px solid #D1D5DB' }} />
            <span className="text-gray-600 truncate" style={{ fontSize:10 }}>{c}</span>
          </div>
        ))}
        <span className="text-blue-500 font-medium cursor-default" style={{ fontSize:10 }}>View all (13)</span>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-gray-800" style={{ fontSize:13 }}>Technologies</p>
          <svg width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50" style={{ border:'1px solid #E5E7EB' }}>
          <SearchIcon />
          <span style={{ fontSize:10, color:'#9CA3AF' }}>Search technologies...</span>
        </div>
      </div>
    </div>
  )

  // ── Event sidebar ──────────────────────────────────────────────────────────
  const EventSidebar = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white" style={{ border:'1px solid #E5E7EB' }}>
        <SearchIcon />
        <span style={{ fontSize:11, color:'#9CA3AF' }}>Search events...</span>
      </div>
      <div>
        <p className="font-bold text-gray-800 mb-2" style={{ fontSize:13 }}>Status</p>
        {Object.entries(sCfg).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2 py-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
            <span className="text-gray-600" style={{ fontSize:11 }}>{cfg.label}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-gray-800" style={{ fontSize:13 }}>Event Type</p>
          <svg width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 mb-2" style={{ border:'1px solid #E5E7EB' }}>
          <SearchIcon />
          <span style={{ fontSize:10, color:'#9CA3AF' }}>Search event type...</span>
        </div>
        {['Challenge','Community Event','Contribution Program','Fellowship','Internship','Mentorship'].map(t => (
          <div key={t} className="flex items-center gap-2 py-0.5">
            <div className="w-3 h-3 rounded flex-shrink-0" style={{ border:'1px solid #D1D5DB' }} />
            <span className="text-gray-600 truncate" style={{ fontSize:10 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )

  // ── Org card — bigger to fill space ────────────────────────────────────────
  const OrgCard = ({ org }) => {
    const hue = (org.name||'').split('').reduce((a,c) => a+c.charCodeAt(0), 0) % 360
    const allYears = org.participationYears?.length ? [...org.participationYears].sort((a,b)=>b-a) : []
    const latestYear = allYears[0] || null
    const logoSrc = orgMockLogos[org.id] || null
    return (
      <div className="bg-white rounded-2xl overflow-hidden flex flex-col" style={{ border:'1px solid #E5E7EB' }}>
        {/* Logo area — tall */}
        <div className="flex items-center justify-center flex-shrink-0"
          style={{ height:130, background:'#F9FAFB', borderBottom:'1px solid #F0F0F0' }}>
          {logoSrc ? (
            <img src={logoSrc} alt={org.name} className="max-h-20 max-w-[80%] object-contain"
              onError={e => {
                e.currentTarget.style.display = 'none'
                if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex'
              }} loading="lazy" />
          ) : null}
          <div style={{ display: logoSrc?'none':'flex', width:52, height:52, borderRadius:12, background:`hsl(${hue},50%,48%)`, alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:16 }}>
            {(org.name||'?').slice(0,2).toUpperCase()}
          </div>
        </div>
        {/* Body */}
        <div className="px-3 pt-3 pb-4 flex flex-col gap-2 flex-1">
          <p className="font-bold text-gray-900 text-center leading-snug line-clamp-2" style={{ fontSize:13 }}>{org.name}</p>
          {org.category && (
            <div className="flex justify-center">
              <span className="px-2.5 py-1 rounded text-white font-bold uppercase" style={{ background:catBg(org.category), fontSize:9, letterSpacing:'0.04em' }}>
                {org.category}
              </span>
            </div>
          )}
          {latestYear && (
            <div className="flex justify-center">
              <span className="px-3 py-0.5 rounded text-white font-semibold" style={{ background:'#1E3A5F', fontSize:10 }}>{latestYear}</span>
            </div>
          )}
          {(org.technologies||[]).length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {(org.technologies||[]).slice(0,3).map(t => (
                <span key={t} className="px-2 py-0.5 rounded text-gray-600 bg-gray-100" style={{ fontSize:9, border:'1px solid #E5E7EB' }}>{t}</span>
              ))}
              {(org.technologies||[]).length > 3 && (
                <span className="text-gray-400" style={{ fontSize:9 }}>{(org.technologies).length-3} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Event card — bigger to fill space ─────────────────────────────────────
  const EvCard = ({ ev }) => {
    const cfg = sCfg[ev.status] || sCfg.upcoming
    const logoSrc = ev.logo ? `/event-logos/${ev.logo}` : null
    const initials = (ev.name||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
    const palette = ['#4F46E5','#0891B2','#059669','#D97706','#DC2626','#7C3AED']
    const accent  = palette[(ev.name||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0) % palette.length]
    const isPaid  = ev.stipend && !ev.stipend.toLowerCase().startsWith('unpaid') && !ev.stipend.toLowerCase().startsWith('not specified')
    const deadline = ev.applicationDeadline
      ? (() => { try { return new Date(ev.applicationDeadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) } catch { return null } })()
      : null

    return (
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-2.5" style={{ border:'1px solid #E5E7EB' }}>
        {/* Header: logo + name + status */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ width:48, height:48, background: logoSrc ? '#F9FAFB' : accent, border:'1px solid rgba(0,0,0,0.08)' }}>
            {logoSrc
              ? <img src={logoSrc} alt="" className="w-full h-full object-contain p-1"
                  onError={e=>{ e.currentTarget.style.display='none'; if(e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display='flex' }} loading="lazy" />
              : null
            }
            <div style={{ display:logoSrc?'none':'flex', width:'100%', height:'100%', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>{initials}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5">
              <p className="font-bold text-gray-900 leading-snug line-clamp-2" style={{ fontSize:12 }}>{ev.name}</p>
              <span className="flex-shrink-0 flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                style={{ background:cfg.bg, color:cfg.color, fontSize:8.5 }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background:cfg.dot }} />
                {cfg.label}
              </span>
            </div>
            <p className="text-gray-400 truncate mt-0.5" style={{ fontSize:9 }}>{ev.organizer}</p>
          </div>
        </div>

        {/* Type + scope */}
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-full font-medium" style={{ background:'#EEF2FF', color:'#4338CA', fontSize:9, border:'1px solid #C7D2FE' }}>{ev.type}</span>
          {ev.eventScope && <span className="px-2 py-0.5 rounded-full font-medium" style={{ background:'#F3F4F6', color:'#6B7280', fontSize:9, border:'1px solid #E5E7EB' }}>{ev.eventScope}</span>}
        </div>

        {/* Description */}
        <p className="text-gray-500 line-clamp-2" style={{ fontSize:10, lineHeight:1.5 }}>{ev.shortDescription || ev.description || ''}</p>

        {/* Tech tags */}
        {(ev.technologies||[]).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ev.technologies.slice(0,4).map(t => (
              <span key={t} className="px-2 py-0.5 rounded-full text-gray-600 bg-gray-100" style={{ fontSize:9, border:'1px solid #E5E7EB' }}>{t}</span>
            ))}
            {ev.technologies.length > 4 && <span className="text-gray-400" style={{ fontSize:9 }}>+{ev.technologies.length-4}</span>}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 pt-2" style={{ borderTop:'1px solid #F3F4F6' }}>
          {deadline && ev.status !== 'completed' && (
            <span className="flex items-center gap-1 text-gray-400" style={{ fontSize:9 }}>
              <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#9CA3AF" strokeWidth="1.3"/><path d="M5 1v3M11 1v3M2 7h12" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round"/></svg>
              {deadline}
            </span>
          )}
          {isPaid
            ? <span className="flex items-center gap-1 text-emerald-600 font-medium" style={{ fontSize:9 }}>
                <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#16A34A" strokeWidth="1.3"/><path d="M8 5v6M6 7h4" stroke="#16A34A" strokeWidth="1.1" strokeLinecap="round"/></svg>
                Paid
              </span>
            : ev.stipend?.toLowerCase().startsWith('unpaid')
              ? <span className="text-gray-400" style={{ fontSize:9 }}>Unpaid</span>
              : null
          }
        </div>
      </div>
    )
  }
  return (
    <div className="w-full select-none bg-white"
      style={{ borderRadius:14, overflow:'hidden', border:'1px solid rgba(0,0,0,0.07)', boxShadow:'0 32px 80px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08)' }}
      aria-hidden="true">

      {/* ── Chrome bar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-white" style={{ borderBottom:'1px solid #F0F0F0' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50" style={{ border:'1px solid #E5E7EB', minWidth:200 }}>
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#CCC" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="#CCC" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span className="text-[9px] text-gray-400 tracking-tight">canopuslabs.dev/{tab==='org'?'organizations':'events'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <img src="/logo.png" alt="" className="w-5 h-5 object-contain rounded" />
          <span className="text-[10px] font-bold text-gray-700 tracking-tight">CANOPUS LABS</span>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="flex" style={{ height:680 }}>

        {/* Sidebar */}
        <div className="flex-shrink-0 bg-white overflow-y-auto no-scrollbar p-4"
          style={{ width:200, borderRight:'1px solid #F0F0F0' }}>
          {tab==='org' ? <OrgSidebar /> : <EventSidebar />}
        </div>

        {/* Main */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5" style={{ background:'#FAFAFA' }}>
          {/* Page title */}
          <h2 className="font-bold text-gray-900 mb-0.5" style={{ fontSize:18, letterSpacing:'-0.01em' }}>
            {tab==='org' ? 'Organizations' : 'Open Source Events'}
          </h2>
          <p className="text-gray-500 mb-3" style={{ fontSize:10 }}>
            {tab==='org'
              ? 'Discover open-source organizations participating in Google Summer of Code.'
              : 'Find mentorships, programs, hackathons and events that can kickstart your open-source journey.'}
          </p>
          <p className="text-gray-500 mb-4" style={{ fontSize:10 }}>
            {tab==='org' ? '2,131 results' : '31 events found'}
          </p>

          {/* Cards */}
          {tab==='org' ? (
            <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
              {previewOrgs.map(org => <OrgCard key={org.id} org={org} />)}
            </div>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
              {previewEvents.map(ev => <EvCard key={ev.id} ev={ev} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── Toggle ── */}
      <div className="flex items-center justify-center py-2.5 bg-white" style={{ borderTop:'1px solid #F0F0F0' }}>
        <div className="flex items-center gap-1 p-1 rounded-full bg-gray-100" style={{ border:'1px solid #E5E7EB' }}>
          {[{key:'org',label:'Organizations'},{key:'event',label:'Events'}].map(({key,label}) => (
            <button key={key} onClick={() => setTab(key)}
              className="rounded-full transition-all duration-200"
              style={{ padding:'5px 16px', fontSize:11, fontWeight:tab===key?600:400, background:tab===key?'#0F0F0F':'transparent', color:tab===key?'#fff':'#888', boxShadow:tab===key?'0 1px 4px rgba(0,0,0,0.18)':'none' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })
  const rawY     = useTransform(scrollYProgress, [0, 1], ['50px', '-30px'])
  const rawScale = useTransform(scrollYProgress, [0, 0.6], [0.88, 1.0])
  const rawOpacity = useTransform(scrollYProgress, [0, 0.3], [0.75, 1])
  const mockupY    = useSpring(rawY,     { stiffness: 60, damping: 20 })
  const mockupScale = useSpring(rawScale, { stiffness: 60, damping: 20 })

  return (
    <main className="bg-white overflow-hidden">

      {/* ═══ HERO ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative hero-bg" style={{ minHeight: '100vh', paddingBottom: '80px' }}>

        {/* Atmospheric clouds */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute" style={{ left:'-6%', top:'10%', width:'34%', height:'220px', background:'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(255,255,255,0.92), transparent)', borderRadius:'50%', filter:'blur(28px)', opacity:0.65 }} />
          <div className="absolute" style={{ right:'-5%', top:'7%', width:'30%', height:'200px', background:'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,255,255,0.96), transparent)', borderRadius:'50%', filter:'blur(24px)', opacity:0.55 }} />
          <div className="absolute" style={{ top:'4%', left:'50%', transform:'translateX(-50%)', width:'58%', height:'280px', background:'radial-gradient(ellipse at center, rgba(255,255,255,0.75), transparent 70%)', filter:'blur(40px)', opacity:0.35 }} />
        </div>

        {/* Hero copy */}
        <div className="relative pt-32 pb-0 px-6 md:px-10 max-w-5xl mx-auto text-center z-10">

          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.1 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
              style={{ background:'rgba(255,255,255,0.72)', border:'1px solid rgba(0,0,0,0.09)', backdropFilter:'blur(8px)', color:'rgba(15,15,15,0.60)', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
              {/* <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" /> */}
              Open-source discovery platform
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.65, delay:0.18, ease:[0.16,1,0.3,1] }}
            className="font-heading text-gray-900 text-balance mb-6"
            style={{ fontSize:'clamp(2rem,8vw,4.5rem)', lineHeight:'1.05', fontWeight:600, letterSpacing:'-0.025em' }}>
            Your gateway to<br />open source.
          </motion.h1>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, delay:0.3 }}
            className="max-w-xl mx-auto mb-10"
            style={{ fontSize:'clamp(1rem,2.5vw,1.125rem)', lineHeight:'1.5', fontWeight:400, color:'rgba(15,15,15,0.52)' }}>
            Discover active organizations, open‑source programs and events worth contributing to — all in one place.
          </motion.p>

          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, delay:0.4 }}
            className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/explore" className="btn-dark px-7 py-3 text-sm">Start Now →</Link>
            <Link to="/organizations" className="btn-outline px-7 py-3 text-sm">See features</Link>
          </motion.div>
        </div>

        {/* Mockup popup — hidden on very small screens */}
        <div className="relative z-20 mt-10 sm:mt-16 px-2 md:px-4 max-w-6xl mx-auto hidden sm:block">
          <motion.div style={{ y:mockupY, scale:mockupScale, opacity:rawOpacity, transformOrigin:'top center', willChange:'transform,opacity', borderRadius:'14px', overflow:'hidden' }}>
            <MockupDisplay />
          </motion.div>
        </div>

        {/* Sky fade */}
        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
          style={{ height:'120px', background:'linear-gradient(to bottom, transparent 0%, #ffffff 100%)' }} />
      </section>

      {/* ═══ ECOSYSTEM STRIP ═══════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 md:px-10" style={{ paddingTop:'60px', paddingBottom:'20px', background:'transparent' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center uppercase tracking-widest mb-10"
            style={{ fontSize:11, fontWeight:600, color:'rgba(15,15,15,0.28)', letterSpacing:'0.15em' }}>
            Explore opportunities across the ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {ecosystemEvents.map(({ id, name, logo }) => (
              <EcosystemLogo key={id} name={name} logo={logo} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES BENTO ════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 md:px-10 overflow-hidden" style={{ paddingTop:'80px', paddingBottom:'80px', background:'transparent' }}>
        <div className="max-w-5xl mx-auto w-full">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.5 }}
            className="text-center mb-12">
            <span className="section-label mb-5 block w-fit mx-auto">Platform</span>
            <h2 className="font-heading text-gray-900 text-balance"
              style={{ fontSize:'clamp(1.6rem,4vw,3.25rem)', lineHeight:'1.1', fontWeight:600, letterSpacing:'-0.02em' }}>
              Built for the open-source community
            </h2>
            <p style={{ fontSize:'clamp(0.9rem,2vw,1rem)', lineHeight:'1.6' }} className="text-gray-500 mt-4 max-w-md mx-auto">
              Smart, curated and designed around how contributors actually discover and engage with open source.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Organizations */}
            <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.5 }}
              className="card-light p-5 sm:p-7 group overflow-hidden min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-200 transition-colors duration-200">
                <Building2 size={20} className="text-gray-800" />
              </div>
              <h3 className="font-heading text-gray-900 mb-2 tracking-tight" style={{ fontSize:'18px', lineHeight:'1.5', fontWeight:600 }}>Organizations</h3>
              <p style={{ fontSize:'16px', lineHeight:'1.6' }} className="text-gray-500 mb-6">
                Discover active open-source organizations and find projects worth contributing to.
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {organizations.slice(0, 3).map(org => {
                  const mockLogo = orgMockLogos[org.id]
                  return (
                    <div key={org.id} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-150 overflow-hidden min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-white overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                        {mockLogo ? (
                          <img src={mockLogo} alt="" className="w-full h-full object-contain p-0.5" loading="lazy" />
                        ) : (
                          <span className="text-white font-bold text-[8px]"
                            style={{ background: `hsl(${(org.name||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0)%360},50%,48%)` }}>
                            {(org.name||'?').slice(0,1).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-800 flex-1 truncate min-w-0">{org.name}</span>
                      {org.programs?.slice(0,1).map(p => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-900 text-white flex-shrink-0 ml-auto">{p}</span>
                      ))}
                    </div>
                  )
                })}
              </div>
              <Link to="/organizations" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all duration-200">
                Explore Organizations <ArrowRight size={14} />
              </Link>
            </motion.div>

            <div className="flex flex-col gap-5">
              {/* Events */}
              <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.5, delay:0.1 }}
                className="card-light p-5 sm:p-7 group flex-1 overflow-hidden min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-200 transition-colors duration-200">
                  <CalendarDays size={20} className="text-gray-800" />
                </div>
                <h3 className="font-heading text-gray-900 mb-2 tracking-tight" style={{ fontSize:'18px', lineHeight:'1.5', fontWeight:600 }}>Events</h3>
                <p style={{ fontSize:'16px', lineHeight:'1.6' }} className="text-gray-500 mb-5">
                  Find mentorships, hackathons and contribution programs — all in one directory.
                </p>
                <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all duration-200">
                  Explore Events <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* Every Stack */}
              <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.5, delay:0.15 }}
                className="card-light p-5 sm:p-7 group overflow-hidden min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-200 transition-colors duration-200">
                  <Terminal size={20} className="text-gray-800" />
                </div>
                <h3 className="font-heading text-gray-900 mb-3 tracking-tight" style={{ fontSize:'18px', lineHeight:'1.5', fontWeight:600 }}>Every Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Python','Go','Rust','JavaScript','AI / ML','Cloud','DevOps','Java'].map(t => (
                    <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-default">{t}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 md:px-10" style={{ paddingTop:'60px', paddingBottom:'80px', background:'transparent' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="section-label mb-4 block w-fit">How it works</span>
              <h2 className="font-heading text-gray-900 tracking-tight"
                style={{ fontSize:'clamp(1.6rem,4vw,3.25rem)', lineHeight:'1.1', fontWeight:600, letterSpacing:'-0.02em' }}>
                From discovery<br />to contribution.
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Three simple steps to find the right open-source opportunity.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num:'01', icon:Code2,     title:'Discover',   desc:'Browse organizations and events across the entire open-source ecosystem — curated and ready to explore.' },
              { num:'02', icon:Layers,    title:'Explore',    desc:'Dive into the details — technologies, programs, contribution guides, repos and application processes.' },
              { num:'03', icon:GitBranch, title:'Contribute', desc:'Visit the project, apply to programs and make your first meaningful contribution to open source.' },
            ].map(({ num, icon:Icon, title, desc }, i) => (
              <motion.div key={num} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.5, delay:i*0.1 }}
                className="card-light p-7">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Icon size={20} className="text-gray-800" />
                  </div>
                  <span className="font-heading font-bold text-4xl tracking-tight" style={{ color:'rgba(0,0,0,0.06)' }}>{num}</span>
                </div>
                <h3 className="font-heading text-gray-900 mb-2" style={{ fontSize:'18px', lineHeight:'1.5', fontWeight:600 }}>{title}</h3>
                <p style={{ fontSize:'16px', lineHeight:'1.6' }} className="text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 md:px-10" style={{ paddingTop:'60px', paddingBottom:'60px', background:'transparent' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.4 }}
            className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">
            Open-source ecosystem, by the numbers
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
            {stats.map(({ value, label, sub }, i) => (
              <motion.div key={label} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.5, delay:i*0.08 }}
                className="flex flex-col items-center text-center px-4 py-6 relative group">
                {i>0 && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16" style={{ background:'rgba(0,0,0,0.10)' }} />}
                <span className="font-heading text-gray-900 mb-1 block"
                  style={{ fontSize:'clamp(2rem,6vw,3.5rem)', lineHeight:'1', fontWeight:700, letterSpacing:'-0.03em' }}>{value}</span>
                <span className="font-heading text-gray-800 mb-0.5 block"
                  style={{ fontSize:'clamp(0.8rem,1.5vw,0.9375rem)', fontWeight:600, lineHeight:'1.4' }}>{label}</span>
                <span style={{ fontSize:'clamp(0.7rem,1.2vw,0.8125rem)', lineHeight:'1.4', color:'rgba(0,0,0,0.38)' }}>{sub}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-8" style={{ fontSize:'13px', color:'rgba(0,0,0,0.32)' }}>
            Sample figures — updated as the platform grows
          </p>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 md:px-10" style={{ paddingTop:'80px', paddingBottom:'80px', background:'transparent' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.5 }} className="text-center mb-12">
            <span className="section-label mb-5 block w-fit mx-auto">Community</span>
            <h2 className="font-heading text-gray-900 tracking-tight"
              style={{ fontSize:'clamp(1.6rem,4vw,3.25rem)', lineHeight:'1.1', fontWeight:600, letterSpacing:'-0.02em' }}>
              Loved by contributors worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.5, delay:i*0.1 }}
                className="flex flex-col justify-between rounded-2xl p-7"
                style={{ background:'rgba(255,255,255,0.65)', border:'1px solid rgba(0,0,0,0.08)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', boxShadow:'0 4px 24px rgba(0,0,0,0.05)' }}>
                <div className="text-gray-200 mb-5 select-none" style={{ fontSize:'48px', lineHeight:1, fontFamily:'Georgia,serif', fontWeight:700 }} aria-hidden="true">"</div>
                <p className="text-gray-700 flex-1 mb-8" style={{ fontSize:'16px', lineHeight:'1.6', fontWeight:400 }}>{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background:`hsl(${t.name.charCodeAt(0)*37%360},45%,52%)`, fontSize:'11px', fontWeight:700 }}>
                    {t.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontSize:'14px', fontWeight:600, lineHeight:'1.4' }} className="text-gray-900">{t.name}</p>
                    <p style={{ fontSize:'13px', lineHeight:'1.4', color:'rgba(0,0,0,0.40)' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA + FOOTER — shared sky bg ═════════════════════════════════ */}
      <div style={{ background:'linear-gradient(160deg, #B8CEDA 0%, #C8D9E5 30%, #DDE8EF 60%, #EDE0D5 100%)' }}>
        <section className="relative overflow-hidden px-4 sm:px-6 md:px-10" style={{ paddingTop:'80px', paddingBottom:'60px' }}>
          <div aria-hidden="true" className="absolute pointer-events-none"
            style={{ top:'-20%', left:'50%', transform:'translateX(-50%)', width:'70%', height:'400px', background:'radial-gradient(ellipse at center, rgba(255,255,255,0.8), transparent 70%)', filter:'blur(50px)', opacity:0.5 }} />
          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6 }}>
              <h2 className="font-heading text-gray-900 tracking-tight leading-none text-balance mb-5"
                style={{ fontSize:'clamp(1.6rem,5vw,3.25rem)', lineHeight:'1.1', fontWeight:600, letterSpacing:'-0.02em' }}>
                Your first contribution<br />could start here.
              </h2>
              <p className="mb-8 max-w-lg mx-auto"
                style={{ fontSize:'clamp(0.9rem,2vw,1.125rem)', lineHeight:'1.5', fontWeight:400, color:'rgba(15,15,15,0.58)' }}>
                Explore organizations, discover events and find your place in the open-source world.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/explore" className="btn-dark">Start Exploring →</Link>
                <Link to="/organizations" className="btn-outline">Browse Organizations</Link>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>

    </main>
  )
}
