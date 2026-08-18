import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Organizations from './pages/Organizations'
import OrganizationDetail from './pages/OrganizationDetail'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])
  return null
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}

function PageWrap({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: '80px' }}>
      <div className="text-center">
        <p className="font-heading text-8xl font-bold text-gray-900 mb-4 tracking-tighter" style={{ opacity: 0.07 }}>404</p>
        <p className="font-heading text-2xl font-bold text-gray-900 mb-3">Page not found</p>
        <p className="text-sm text-gray-400 mb-10">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-dark">Back to Home</a>
      </div>
    </main>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"                    element={<PageWrap><Home /></PageWrap>} />
        <Route path="/explore"             element={<PageWrap><Explore /></PageWrap>} />
        <Route path="/organizations"       element={<PageWrap><Organizations /></PageWrap>} />
        <Route path="/organizations/:slug" element={<PageWrap><OrganizationDetail /></PageWrap>} />
        <Route path="/events"              element={<PageWrap><Events /></PageWrap>} />
        <Route path="/events/:slug"        element={<PageWrap><EventDetail /></PageWrap>} />
        <Route path="*"                    element={<PageWrap><NotFound /></PageWrap>} />
      </Routes>
    </AnimatePresence>
  )
}

// Footer wrapper — on home page it gets the sky gradient bg,
// on all other pages it uses transparent (body gradient shows through)
function FooterWithBg() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // On home, Footer is rendered inside Home.jsx's shared bg wrapper
  if (isHome) return null

  // On other pages, wrap footer in the same sky gradient
  return (
    <div style={{ background: 'linear-gradient(160deg, #B8CEDA 0%, #C8D9E5 30%, #DDE8EF 60%, #EDE0D5 100%)' }}>
      <Footer />
    </div>
  )
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <AnimatedRoutes />
      </div>
      <FooterWithBg />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
