import { Search } from 'lucide-react'

export default function EmptyState({ title = 'No results found', subtitle = 'Try adjusting your search or filters.', onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-black/8 flex items-center justify-center mb-5">
        <Search size={20} className="text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-base font-bold text-[#0F0F0F] mb-2">{title}</h3>
      <p className="text-sm text-[#999] max-w-xs leading-relaxed mb-6">{subtitle}</p>
      {onReset && (
        <button onClick={onReset} className="btn-outline text-sm py-2.5 px-5">Clear filters</button>
      )}
    </div>
  )
}
