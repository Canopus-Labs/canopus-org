export default function Tag({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    accent:  'bg-gray-900 text-white border border-transparent',
    purple:  'bg-indigo-50 text-indigo-700 border border-indigo-100',
    green:   'bg-emerald-50 text-emerald-700 border border-emerald-100',
    outline: 'bg-transparent text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-900',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-150 ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
