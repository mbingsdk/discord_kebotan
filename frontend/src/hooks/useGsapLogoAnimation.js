// hooks/useGsapLogoAnimation.js
import { useEffect } from 'react'
import gsap from 'gsap'

export default function useGsapLogoAnimation() {
  useEffect(() => {
    gsap.set('#logo-group', { scale: 0.8, opacity: 0 })
    gsap.set('#logo-group path', { opacity: 0, y: 30 })

    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } })
    tl.to('#logo-group', { scale: 1, opacity: 1, duration: 0.5 })
      .to('#main-path', { opacity: 1, y: 0 }, '-=0.3')
      .to('#secondary-path', { opacity: 1, y: 0 }, '-=0.4')
      .to('#accent-path', { opacity: 1, y: 0 }, '-=0.4')

    gsap.to('#svg-logo', {
      scale: 1.05,
      transformOrigin: 'center center',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      duration: 1.2
    })
  }, [])
}
