import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight, Github, CheckCircle2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import HeroVisualGrid from './HeroVisualGrid';
import { scrollToSection } from '../utils/scroll';

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const namePlaneRef = useRef<HTMLHeadingElement | null>(null);
  const midgroundRef = useRef<HTMLDivElement | null>(null);
  const roleRef = useRef<HTMLParagraphElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const proofRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (id: string) => {
    scrollToSection(id);
  };

  useEffect(() => {
    const heroEl = heroRef.current;
    const nameEl = namePlaneRef.current;
    const midgroundEl = midgroundRef.current;
    if (!heroEl) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    let prefersReducedMotion = reducedMotionQuery.matches;
    let hasFineHover = hoverQuery.matches;

    // 1. Entrance Timeline using GSAP (animates container wrapper so 3D planes remain pure)
    let ctx: gsap.Context | null = null;
    if (!prefersReducedMotion) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: {
            ease: 'power2.out',
          }
        });

        tl.fromTo(
          statusRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35 },
          0
        )
        .fromTo(
          namePlaneRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.38 },
          0.06
        )
        .fromTo(
          [roleRef.current, headlineRef.current],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 },
          0.12
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35 },
          0.18
        )
        .fromTo(
          proofRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35 },
          0.24
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35 },
          0.3
        );
      }, heroRef);
    }

    // 2. Coordinated Depth Hierarchy (Single camera / pointer space across Hero)
    // Foreground: Hero Name (100% intensity)
    let rotateXTo: ((value: number) => void) | null = null;
    let rotateYTo: ((value: number) => void) | null = null;
    let translateZTo: ((value: number) => void) | null = null;
    let xTo: ((value: number) => void) | null = null;
    let yTo: ((value: number) => void) | null = null;

    // Midground: Role + Positioning Block (25-35% intensity, cohesive unit)
    let midRotateXTo: ((value: number) => void) | null = null;
    let midRotateYTo: ((value: number) => void) | null = null;
    let midTranslateZTo: ((value: number) => void) | null = null;
    let midXTo: ((value: number) => void) | null = null;
    let midYTo: ((value: number) => void) | null = null;

    if (hasFineHover && !prefersReducedMotion) {
      if (nameEl) {
        gsap.set(nameEl, {
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          willChange: 'transform, text-shadow',
        });

        rotateXTo = gsap.quickTo(nameEl, 'rotateX', { duration: 0.45, ease: 'power2.out' });
        rotateYTo = gsap.quickTo(nameEl, 'rotateY', { duration: 0.45, ease: 'power2.out' });
        translateZTo = gsap.quickTo(nameEl, 'translateZ', { duration: 0.45, ease: 'power2.out' });
        xTo = gsap.quickTo(nameEl, 'x', { duration: 0.45, ease: 'power2.out' });
        yTo = gsap.quickTo(nameEl, 'y', { duration: 0.45, ease: 'power2.out' });
      }

      if (midgroundEl) {
        gsap.set(midgroundEl, {
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
        });

        midRotateXTo = gsap.quickTo(midgroundEl, 'rotateX', { duration: 0.45, ease: 'power2.out' });
        midRotateYTo = gsap.quickTo(midgroundEl, 'rotateY', { duration: 0.45, ease: 'power2.out' });
        midTranslateZTo = gsap.quickTo(midgroundEl, 'translateZ', { duration: 0.45, ease: 'power2.out' });
        midXTo = gsap.quickTo(midgroundEl, 'x', { duration: 0.45, ease: 'power2.out' });
        midYTo = gsap.quickTo(midgroundEl, 'y', { duration: 0.45, ease: 'power2.out' });
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion || !hasFineHover) return;

      const rect = heroEl.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.35;
      const centerY = rect.top + rect.height * 0.35;

      // Unified single pointer coordinate system
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.45)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 0.45)));
      const distFromCenter = Math.sqrt(normX * normX + normY * normY);

      // --- Layer 1: Foreground - Hero Name (100% intensity) ---
      if (rotateXTo && rotateYTo && translateZTo && xTo && yTo && nameEl) {
        const targetRotateX = -normY * 7.5;
        const targetRotateY = normX * 9.5;
        const targetTranslateZ = Math.max(0, (1 - distFromCenter * 0.45) * 8);
        const targetX = normX * 4.5;
        const targetY = normY * 3;

        rotateXTo(targetRotateX);
        rotateYTo(targetRotateY);
        translateZTo(targetTranslateZ);
        xTo(targetX);
        yTo(targetY);

        // Subtle dynamic lighting depth cue that shifts synchronously with 3D tilt
        const shadowX = (-normX * 8).toFixed(1);
        const shadowY = (-normY * 5 + 3).toFixed(1);
        nameEl.style.textShadow = `${shadowX}px ${shadowY}px 18px rgba(99, 102, 241, 0.22), ${shadowX}px ${shadowY}px 5px rgba(0, 0, 0, 0.5)`;
      }

      // --- Layer 2: Midground - Role & Positioning (25-35% coordinated intensity) ---
      if (midRotateXTo && midRotateYTo && midTranslateZTo && midXTo && midYTo) {
        const midRotateX = -normY * 2.2;
        const midRotateY = normX * 2.8;
        const midTranslateZ = Math.max(0, (1 - distFromCenter * 0.45) * 2.4);
        const midX = normX * 1.5;
        const midY = normY * 1.0;

        midRotateXTo(midRotateX);
        midRotateYTo(midRotateY);
        midTranslateZTo(midTranslateZ);
        midXTo(midX);
        midYTo(midY);
      }
    };

    const handlePointerLeave = () => {
      // Smooth synchronized return of all layers to neutral resting state
      if (rotateXTo && rotateYTo && translateZTo && xTo && yTo && nameEl) {
        rotateXTo(0);
        rotateYTo(0);
        translateZTo(0);
        xTo(0);
        yTo(0);
        
        gsap.to(nameEl, {
          textShadow: '0px 0px 0px rgba(0,0,0,0)',
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      if (midRotateXTo && midRotateYTo && midTranslateZTo && midXTo && midYTo) {
        midRotateXTo(0);
        midRotateYTo(0);
        midTranslateZTo(0);
        midXTo(0);
        midYTo(0);
      }
    };

    if (hasFineHover && !prefersReducedMotion) {
      heroEl.addEventListener('pointermove', handlePointerMove, { passive: true });
      heroEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        if (nameEl) gsap.set(nameEl, { rotateX: 0, rotateY: 0, translateZ: 0, x: 0, y: 0, clearProps: 'all' });
        if (midgroundEl) gsap.set(midgroundEl, { rotateX: 0, rotateY: 0, translateZ: 0, x: 0, y: 0, clearProps: 'all' });
      }
    };

    const handleHoverChange = (e: MediaQueryListEvent) => {
      hasFineHover = e.matches;
      if (!hasFineHover) {
        if (nameEl) gsap.set(nameEl, { rotateX: 0, rotateY: 0, translateZ: 0, x: 0, y: 0, clearProps: 'all' });
        if (midgroundEl) gsap.set(midgroundEl, { rotateX: 0, rotateY: 0, translateZ: 0, x: 0, y: 0, clearProps: 'all' });
      }
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    hoverQuery.addEventListener('change', handleHoverChange);

    return () => {
      ctx?.revert();
      heroEl.removeEventListener('pointermove', handlePointerMove);
      heroEl.removeEventListener('pointerleave', handlePointerLeave);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      hoverQuery.removeEventListener('change', handleHoverChange);
      if (nameEl) {
        gsap.set(nameEl, { clearProps: 'all' });
      }
      if (midgroundEl) {
        gsap.set(midgroundEl, { clearProps: 'all' });
      }
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      id="hero" 
      className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-[#070b15] pt-32 pb-16 px-4 sm:px-6 lg:px-8 scroll-mt-20 md:scroll-mt-24 border-b border-white/5"
    >
      {/* Subtle ambient backdrop glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      {/* Interactive technical layout grid motion layer */}
      <HeroVisualGrid containerRef={heroRef} />

      <div className="relative z-10 mx-auto max-w-6xl w-full">
        
        {/* 1. Availability Status */}
        <div
          ref={statusRef}
          id="hero-status"
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for selected work</span>
          </div>
        </div>

        {/* 2. Primary Role & Headline */}
        <div className="space-y-3">
          {/* Foreground Layer (100%): 3D-reactive Name Plane */}
          <div 
            className="inline-block" 
            style={{ perspective: '800px', perspectiveOrigin: 'left center' }}
          >
            <h1 
              ref={namePlaneRef}
              id="hero-name"
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight cursor-default select-text inline-block origin-left"
              style={{ transformStyle: 'preserve-3d' }}
            >
              Dmitry Bashkatov
            </h1>
          </div>

          {/* Midground Layer (25-35%): Role + Positioning Headline as a single cohesive unit */}
          <div 
            ref={midgroundRef}
            className="space-y-3 origin-left"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <p 
              ref={roleRef}
              id="hero-role"
              className="font-mono text-base sm:text-lg text-indigo-400 font-semibold tracking-wide"
            >
              Web Developer · WordPress & Shopify
            </p>

            {/* 3. Central Brand Core Idea */}
            <div 
              ref={headlineRef}
              id="hero-tagline"
              className="pt-1.5 pb-0.5"
            >
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 leading-snug max-w-3xl">
                Pixel-perfect for users. <br className="hidden sm:inline" />
                Editable for teams. <br className="hidden sm:inline" />
                Maintainable for developers.
              </h2>
            </div>
          </div>

          {/* 4. Supporting Description (constrained to ~680-720px, stable static plane) */}
          <p 
            ref={descRef}
            id="hero-desc"
            className="font-sans text-sm sm:text-base text-slate-400 max-w-[700px] leading-relaxed"
          >
            15+ years of frontend experience, building production websites from Figma across custom WordPress themes, Gutenberg blocks, and Shopify Liquid storefronts.
          </p>
        </div>

        {/* 5. Proof Line - Clean spacing separation without competing border-lines */}
        <div
          ref={proofRef}
          id="hero-proof"
          className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-mono py-1"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
            <span>15+ Years of Frontend Experience</span>
          </div>
          <span className="hidden sm:inline text-slate-700">·</span>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
            <span>WordPress & Shopify Specialist</span>
          </div>
          <span className="hidden sm:inline text-slate-700">·</span>
          <div className="flex items-center gap-2 text-slate-400 font-normal">
            <CheckCircle2 size={13} className="text-slate-400 shrink-0" />
            <span>Performance & Core Web Vitals</span>
          </div>
        </div>

        {/* 6. Action CTAs */}
        <div
          ref={ctaRef}
          id="hero-cta"
          className="mt-6 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => scrollTo('featured-work')}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-sans text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-all cursor-pointer"
          >
            <span>Explore Featured Work</span>
            <ArrowDown size={15} />
          </button>

          <button
            onClick={() => scrollTo('archive')}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-sans text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-all cursor-pointer"
          >
            <span>View All Projects</span>
          </button>

          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-3 font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-lg"
          >
            <Github size={15} />
            <span>github.com/dbaik</span>
            <ArrowUpRight size={13} className="text-slate-400" />
          </a>
        </div>

      </div>
    </section>
  );
}
