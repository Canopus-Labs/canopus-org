export default function FilterBar({ filters, active, onChange, className = '' }) {
  return (
    <div role="group" aria-label="Filter options"
      className={`flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={active === filter ? 'chip-active' : 'chip'}
          aria-pressed={active === filter}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
