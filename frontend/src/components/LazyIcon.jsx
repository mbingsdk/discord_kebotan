// components/LazyIcon.jsx
import { lazy, Suspense, memo } from 'react'

const iconCache = {}

function loadIcon(name) {
  return lazy(async () => {
    if (!iconCache[name]) {
      const mod = await import('./icons/icons.js') // relatif ke lokasi file ini
      iconCache[name] = mod[name] || (() => <span>❓</span>)
    }
    return { default: iconCache[name] }
  })
}

function LazyIcon({ name, className = '' }) {
  const IconComponent = loadIcon(name)

  return (
    <Suspense fallback={<span className="loading loading-spinner" />}>
      <IconComponent className={className} />
    </Suspense>
  )
}

export default memo(LazyIcon)
