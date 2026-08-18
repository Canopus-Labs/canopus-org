import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle, children }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: '120px', paddingBottom: '48px', background: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Section heading: 52px / 1.1 / 600 */}
          <h1
            className="font-heading text-gray-900 tracking-tight mb-4"
            style={{ fontSize: '52px', lineHeight: '1.1', fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>
          {/* Subheading: 18px / 1.5 / 400 */}
          {subtitle && (
            <p
              className="text-gray-500 max-w-2xl"
              style={{ fontSize: '18px', lineHeight: '1.5', fontWeight: 400 }}
            >
              {subtitle}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </motion.div>
      </div>
    </section>
  )
}
