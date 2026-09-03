import React, { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { PERSONAL_INFO } from '../data/portfolioData'
import { scrollToSection } from '../utils/scroll'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const brandLinkRef = useRef<HTMLAnchorElement | null>(null)
  const logoStageRef = useRef<HTMLDivElement | null>(null)
  const logoBoxRef = useRef<HTMLDivElement | null>(null)

  const navLinks = [
    { name: 'Work', href: '#featured-work' },
    { name: 'Services', href: '#services' },
    { name: 'Why Me', href: '#why-me' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } | null }).__lenis
    lenis?.stop()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      lenis?.start()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const sectionIds = ['hero', 'featured-work', 'services', 'why-me', 'experience', 'contact']
    const anchorY = 140
    let rafId: number | null = null

    const updateActiveSection = () => {
      rafId = null
      let current = sectionIds[0]

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue

        const { top, bottom } = el.getBoundingClientRect()
        if (top <= anchorY && bottom > anchorY) {
          current = id
          break
        }

        if (top <= anchorY) {
          current = id
        }
      }

      setActiveSection(current)
    }

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateActiveSection)
      }
    }

    updateActiveSection()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  // Load GSAP only on fine-pointer hover — keeps it off the initial critical path
  useEffect(() => {
    const brandEl = brandLinkRef.current
    const stageEl = logoStageRef.current
    const logoEl = logoBoxRef.current
    if (!brandEl || !stageEl || !logoEl) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasFineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (prefersReducedMotion || !hasFineHover) return

    let cancelled = false
    let tiltReady = false
    let cleanupTilt: (() => void) | null = null

    const enableTilt = async () => {
      if (tiltReady || cancelled) return
      tiltReady = true
      const { default: gsap } = await import('gsap')
      if (cancelled || !brandEl.isConnected) return

      gsap.set(logoEl, {
        transformOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform'
      })

      const rotateXTo = gsap.quickTo(logoEl, 'rotationX', { duration: 0.3, ease: 'power2.out' })
      const rotateYTo = gsap.quickTo(logoEl, 'rotationY', { duration: 0.3, ease: 'power2.out' })
      const zTo = gsap.quickTo(logoEl, 'z', { duration: 0.3, ease: 'power2.out' })
      const xTo = gsap.quickTo(logoEl, 'x', { duration: 0.3, ease: 'power2.out' })
      const yTo = gsap.quickTo(logoEl, 'y', { duration: 0.3, ease: 'power2.out' })

      const handlePointerMove = (e: PointerEvent) => {
        const stageRect = stageEl.getBoundingClientRect()
        if (!stageRect.width || !stageRect.height) return

        const centerX = stageRect.left + stageRect.width / 2
        const centerY = stageRect.top + stageRect.height / 2
        const dx = e.clientX - centerX
        const dy = e.clientY - centerY
        const absX = Math.abs(dx)
        const absY = Math.abs(dy)
        const signX = dx === 0 ? 0 : Math.sign(dx)
        const signY = dy === 0 ? 0 : Math.sign(dy)
        const normX = signX * Math.min(1, Math.pow(absX / (absX + 50), 0.7))
        const normY = signY * Math.min(1, Math.pow(absY / (absY + 16), 0.7))

        rotateXTo(-normY * 18)
        rotateYTo(normX * 20)
        zTo(6)
        xTo(normX * 2.5)
        yTo(normY * 2.5)
      }

      const handlePointerLeave = () => {
        rotateXTo(0)
        rotateYTo(0)
        zTo(0)
        xTo(0)
        yTo(0)
      }

      brandEl.addEventListener('pointermove', handlePointerMove, { passive: true })
      brandEl.addEventListener('pointerleave', handlePointerLeave, { passive: true })

      cleanupTilt = () => {
        brandEl.removeEventListener('pointermove', handlePointerMove)
        brandEl.removeEventListener('pointerleave', handlePointerLeave)
        gsap.set(logoEl, { clearProps: 'all' })
      }
    }

    const handleFirstEnter = () => {
      brandEl.removeEventListener('pointerenter', handleFirstEnter)
      void enableTilt()
    }

    brandEl.addEventListener('pointerenter', handleFirstEnter, { passive: true })

    const idleWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
        cancelIdleCallback?: (id: number) => void
      }
    let cancelIdle: () => void
    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(
        () => {
          void enableTilt()
        },
        { timeout: 1800 }
      )
      cancelIdle = () => idleWindow.cancelIdleCallback?.(idleId)
    } else {
      const timeoutId = window.setTimeout(() => {
        void enableTilt()
      }, 400)
      cancelIdle = () => window.clearTimeout(timeoutId)
    }

    return () => {
      cancelled = true
      cancelIdle()
      brandEl.removeEventListener('pointerenter', handleFirstEnter)
      cleanupTilt?.()
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    setActiveSection(href.replace('#', ''))
    scrollToSection(href)
  }

  const headerFilled = isScrolled || isMobileMenuOpen

  return (
    <>
    {isMobileMenuOpen ? (
      <button
        type="button"
        aria-label="Close navigation menu"
        className="mobile-nav-backdrop fixed inset-0 z-40 md:hidden border-0 backdrop-blur-md cursor-pointer"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    ) : null}
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-[background-color,border-color,box-shadow,padding] duration-300 ${
        headerFilled ? 'border-b border-white/10 bg-[#070b15]' : 'bg-transparent'
      } ${isScrolled && !isMobileMenuOpen ? 'py-3 shadow-lg shadow-black/20' : 'py-4 sm:py-5'}`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <a
          ref={brandLinkRef}
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="group flex items-center gap-2.5 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-lg"
        >
          <div
            ref={logoStageRef}
            className="relative flex items-center justify-center cursor-pointer p-0.5"
            style={{ perspective: '180px' }}
          >
            <div
              ref={logoBoxRef}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/35 text-indigo-400 font-mono text-xs sm:text-sm font-bold transition-colors duration-200 group-hover:bg-indigo-500/25 group-hover:border-indigo-400 group-hover:text-indigo-200 select-none will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="inline-block pointer-events-none font-bold" style={{ transform: 'translateZ(4px)' }}>
                db
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">
              {PERSONAL_INFO.name}
            </span>
            <span className="font-mono text-xs text-slate-400 tracking-wider whitespace-nowrap">WordPress & Shopify Developer</span>
          </div>
        </a>

        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-0.5 lg:gap-1 rounded-full border border-white/10 bg-slate-950/70 p-1 backdrop-blur-md shrink-0"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '')
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-3 py-1.5 text-xs font-medium tracking-wide whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-full ${
                  isActive
                    ? 'text-white font-semibold bg-white/10 border border-white/15'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false)
              setActiveSection('contact')
              scrollToSection('#contact')
            }}
            className="hidden sm:inline-flex items-center rounded-xl bg-indigo-600 px-3.5 py-2 font-sans text-xs font-bold text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors cursor-pointer"
          >
            Discuss a Project
          </button>
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`mx-auto w-full max-w-7xl md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          isMobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 py-5" aria-hidden={!isMobileMenuOpen}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="rounded-lg px-1 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            type="button"
            tabIndex={isMobileMenuOpen ? 0 : -1}
            onClick={() => {
              setIsMobileMenuOpen(false)
              setActiveSection('contact')
              scrollToSection('#contact')
            }}
            className="mt-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-left font-sans text-sm font-bold text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors cursor-pointer sm:hidden"
          >
            Discuss a Project
          </button>
        </nav>
      </div>
    </header>
    </>
  )
}
