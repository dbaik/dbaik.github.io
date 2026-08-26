import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS_DATA } from '../data/portfolioData';
import { scrollToSection } from '../utils/scroll';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const brandLinkRef = useRef<HTMLAnchorElement | null>(null);
  const logoStageRef = useRef<HTMLDivElement | null>(null);
  const logoBoxRef = useRef<HTMLDivElement | null>(null);

  const totalBuildsCount = PROJECTS_DATA.length;

  const navLinks = [
    { name: 'Featured', href: '#featured-work' },
    { name: `Archive (${totalBuildsCount})`, href: '#archive' },
    { name: 'How I Build', href: '#how-i-work' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['hero', 'featured-work', 'archive', 'how-i-work', 'experience', 'skills', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tactile physical 3D tilt response on "db" logo
  useEffect(() => {
    const brandEl = brandLinkRef.current;
    const stageEl = logoStageRef.current;
    const logoEl = logoBoxRef.current;
    if (!brandEl || !stageEl || !logoEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches;

    if (prefersReducedMotion || isTouch) return;

    gsap.set(logoEl, {
      transformOrigin: '50% 50%',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
      willChange: 'transform',
    });

    const rotateXTo = gsap.quickTo(logoEl, 'rotationX', { duration: 0.3, ease: 'power2.out' });
    const rotateYTo = gsap.quickTo(logoEl, 'rotationY', { duration: 0.3, ease: 'power2.out' });
    const zTo = gsap.quickTo(logoEl, 'z', { duration: 0.3, ease: 'power2.out' });
    const xTo = gsap.quickTo(logoEl, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(logoEl, 'y', { duration: 0.3, ease: 'power2.out' });

    const handlePointerMove = (e: PointerEvent) => {
      const stageRect = stageEl.getBoundingClientRect();
      if (!stageRect.width || !stageRect.height) return;

      const centerX = stageRect.left + stageRect.width / 2;
      const centerY = stageRect.top + stageRect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Soft non-linear mapping with distance falloff across the full brand link
      // Prevents hard clamping and saturation when moving from db square to name and subtitle
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const signX = dx === 0 ? 0 : Math.sign(dx);
      const signY = dy === 0 ? 0 : Math.sign(dy);

      // Smooth progression: responsive within logo (0-18px), organic gradient across name (30-140px), gentle orientation across subtitle (150-260px)
      const normX = signX * Math.min(1, Math.pow(absX / (absX + 50), 0.7));
      const normY = signY * Math.min(1, Math.pow(absY / (absY + 16), 0.7));

      // Tactile physical 3D tilt & micro-displacement proportional to pointer position relative to logo
      rotateXTo(-normY * 18);
      rotateYTo(normX * 20);
      zTo(6);
      xTo(normX * 2.5);
      yTo(normY * 2.5);
    };

    const handlePointerLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      zTo(0);
      xTo(0);
      yTo(0);
    };

    brandEl.addEventListener('pointerenter', handlePointerMove, { passive: true });
    brandEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    brandEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      brandEl.removeEventListener('pointerenter', handlePointerMove);
      brandEl.removeEventListener('pointermove', handlePointerMove);
      brandEl.removeEventListener('pointerleave', handlePointerLeave);
      gsap.set(logoEl, { clearProps: 'all' });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070b15]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand identity */}
        <a 
          ref={brandLinkRef}
          href="#hero" 
          onClick={(e) => handleNavClick(e, '#hero')}
          className="group flex items-center gap-2.5 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-lg p-1 -m-1"
        >
          {/* 3D Perspective Stage for db Logo */}
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
              <span 
                className="inline-block pointer-events-none font-bold" 
                style={{ transform: 'translateZ(4px)' }}
              >
                db
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">
              {PERSONAL_INFO.name}
            </span>
            <span className="font-mono text-xs text-slate-400 tracking-wider whitespace-nowrap">
              WordPress & Shopify Dev
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav 
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-0.5 lg:gap-1 rounded-full border border-white/10 bg-slate-950/70 p-1 backdrop-blur-md shrink-0"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-3 py-1.5 text-xs font-medium tracking-wide whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-full ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavTab"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#070b15]/95 backdrop-blur-xl px-6 py-5"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
