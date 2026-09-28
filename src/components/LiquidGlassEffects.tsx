import { useEffect, useRef } from 'react'
import { useTheme } from '@/hooks/use-theme'

const MINIMIZE_AFTER_PX = 120
const SCROLL_THRESHOLD_PX = 6
const WALLPAPER_GLOWS = 6

/**
 * Renders the Liquid Glass wallpaper and drives the motion CSS can't do alone (styles live in index.css):
 * - feeds the pointer position to the glass under it, so its specular light follows the cursor/finger
 * - feeds the mouse position to the wallpaper, so its depth layers shift against it (parallax)
 * - flags scroll direction on <html>, so the floating nav minimizes while scrolling down
 */
export function LiquidGlassEffects() {
  const { theme } = useTheme()
  const isGlass = theme === 'glass-light' || theme === 'glass-dark'
  const wallpaperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isGlass) return

    const root = document.documentElement
    let frame = 0
    let pointer: { x: number; y: number; target: EventTarget | null; isTouch: boolean } | null = null

    const applyPointer = () => {
      frame = 0
      if (!pointer) return

      // A finger drag would yank the wallpaper around, so only mouse and pen move it
      const wallpaper = wallpaperRef.current
      if (wallpaper && !pointer.isTouch) {
        wallpaper.style.setProperty('--glass-px', ((pointer.x / window.innerWidth) * 2 - 1).toFixed(3))
        wallpaper.style.setProperty('--glass-py', ((pointer.y / window.innerHeight) * 2 - 1).toFixed(3))
      }

      if (!(pointer.target instanceof Element)) return

      // Nested glass (a button on a card) each gets its own light position
      let glass = pointer.target.closest<HTMLElement>('.liquid-glass')
      while (glass) {
        const rect = glass.getBoundingClientRect()
        glass.style.setProperty('--glass-x', `${pointer.x - rect.left}px`)
        glass.style.setProperty('--glass-y', `${pointer.y - rect.top}px`)
        glass = glass.parentElement?.closest<HTMLElement>('.liquid-glass') ?? null
      }
    }

    const onPointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY, target: event.target, isTouch: event.pointerType === 'touch' }
      if (!frame) frame = requestAnimationFrame(applyPointer)
    }

    let lastScrollY = window.scrollY
    const onScroll = () => {
      const scrollY = window.scrollY
      if (Math.abs(scrollY - lastScrollY) < SCROLL_THRESHOLD_PX) return
      root.toggleAttribute('data-glass-minimized', scrollY > lastScrollY && scrollY > MINIMIZE_AFTER_PX)
      lastScrollY = scrollY
    }

    document.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('pointerdown', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('scroll', onScroll)
      root.removeAttribute('data-glass-minimized')
    }
  }, [isGlass])

  if (!isGlass) return null

  return (
    <div ref={wallpaperRef} className="glass-wallpaper" aria-hidden="true">
      {Array.from({ length: WALLPAPER_GLOWS }, (_, index) => (
        <div key={index} />
      ))}
    </div>
  )
}
