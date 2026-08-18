import { useState } from 'react'

export default function OrgLogo({ src, name, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false)
  const sizeMap = { sm: 'w-9 h-9', md: 'w-11 h-11', lg: 'w-14 h-14', xl: 'w-[72px] h-[72px]' }
  const fontMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-lg' }
  const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?'
  const hue = name ? name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 210

  return (
    <div
      className={`${sizeMap[size]} rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 ${className}`}
      style={{ border: '1px solid rgba(0,0,0,0.08)' }}
      aria-hidden="true"
    >
      {!imgError && src ? (
        <img src={src} alt="" className="w-full h-full object-contain bg-white p-1.5"
          onError={() => setImgError(true)} loading="lazy" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-bold text-white ${fontMap[size]}`}
          style={{ background: `hsl(${hue}, 50%, 50%)` }}>
          {initials}
        </div>
      )}
    </div>
  )
}
