import { motion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', className = '' }) {
  const center = align === 'center'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex flex-col gap-3 ${center ? 'items-center text-center' : 'items-start text-left'} ${className}`}
    >
      {eyebrow && (
        <span className="section-label">{eyebrow}</span>
      )}
      {/* Section heading: 52px / 1.1 / 600 */}
      <h2
        className="font-heading text-gray-900 text-balance"
        style={{ fontSize: '52px', lineHeight: '1.1', fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      {/* Subheading: 18px / 1.5 / 400 */}
      {subtitle && (
        <p
          className={`text-gray-500 max-w-xl ${center ? 'mx-auto' : ''}`}
          style={{ fontSize: '18px', lineHeight: '1.5', fontWeight: 400 }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
