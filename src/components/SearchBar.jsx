import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: '#BBBBBB' }}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-light pl-11 pr-10"
        aria-label={placeholder}
        autoComplete="off"
        spellCheck="false"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: '#BBBBBB' }}
          aria-label="Clear search"
          type="button"
          onMouseEnter={e => { e.currentTarget.style.color = '#333' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#BBBBBB' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
