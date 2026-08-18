import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Star, GitFork } from 'lucide-react'
import StatusBadge from './StatusBadge'
import OrgLogo from './OrgLogo'
import Tag from './Tag'

export default function OrganizationCard({ org, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
    >
      <Link
        to={`/organizations/${org.slug}`}
        className="group block bg-white rounded-2xl p-5
                   shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
        style={{ border: '1px solid rgba(0,0,0,0.08)' }}
        aria-label={`View ${org.name}`}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <OrgLogo src={org.logo} name={org.name} size="md" />
            <div className="min-w-0">
              <h3 className="font-heading text-sm font-bold text-gray-900 leading-tight truncate
                             group-hover:text-indigo-600 transition-colors duration-150">
                {org.name}
              </h3>
              {org.founded && <p className="text-xs text-gray-400 mt-0.5">Est. {org.founded}</p>}
            </div>
          </div>
          <StatusBadge status={org.status} />
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{org.shortDescription}</p>

        {org.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {org.technologies.slice(0, 3).map(t => <Tag key={t}>{t}</Tag>)}
            {org.technologies.length > 3 && <Tag variant="outline">+{org.technologies.length - 3}</Tag>}
          </div>
        )}

        {org.programs?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {org.programs.map(p => <Tag key={p} variant="accent">{p}</Tag>)}
          </div>
        )}

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3 text-xs text-gray-300">
            {org.stars && <span className="flex items-center gap-1"><Star size={11} />{org.stars}</span>}
            {org.repositories && <span className="flex items-center gap-1"><GitFork size={11} />{org.repositories}</span>}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-900
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View <ArrowUpRight size={12} />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
