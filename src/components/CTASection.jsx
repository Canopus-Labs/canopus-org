import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTASection({
  title = 'Your first contribution could start here.',
  subtitle = 'Explore organizations, discover events and find your place in open source.',
  buttonLabel = 'Start Exploring',
  buttonHref = '/explore',
}) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(2px)',
        }}
      />
      <div className="relative max-w-3xl mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-heading font-bold text-gray-900 tracking-tight leading-tight text-balance mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-10 max-w-lg mx-auto">
            {subtitle}
          </p>
          <Link to={buttonHref} className="btn-dark px-8 py-3.5 text-sm mx-auto">
            {buttonLabel} <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
