import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle, children }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop:    'clamp(80px, 10vw, 120px)',
        paddingBottom: 'clamp(24px, 4vw, 48px)',
        background:    'transparent',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1
            className="font-heading text-gray-900 tracking-tight mb-3 page-title"
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-gray-500 max-w-2xl text-sm sm:text-base"
              style={{ lineHeight: '1.6', fontWeight: 400 }}
            >
              {subtitle}
            </p>
          )}
          {children && <div className="mt-5">{children}</div>}
        </motion.div>
      </div>
    </section>
  )
}
