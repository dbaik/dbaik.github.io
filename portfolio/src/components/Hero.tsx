import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Github } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import AsciiArtCanvas from './AsciiArtCanvas';
import HeroVisualGrid from './HeroVisualGrid';
import { scrollToSection } from '../utils/scroll';

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const namePlaneRef = useRef<HTMLHeadingElement | null>(null);
  const midgroundRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
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
    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    let gsapModule: typeof import('gsap').default | null = null;

    let rotateXTo: ((value: number) => void) | null = null;
    let rotateYTo: ((value: number) => void) | null = null;
    let translateZTo: ((value: number) => void) | null = null;
    let xTo: ((value: number) => void) | null = null;
    let yTo: ((value: number) => void) | null = null;
    let midRotateXTo: ((value: number) => void) | null = null;
    let midRotateYTo: ((value: number) => void) | null = null;
    let midTranslateZTo: ((value: number) => void) | null = null;
    let midXTo: ((value: number) => void) | null = null;
    let midYTo: ((value: number) => void) | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion || !hasFineHover) return;

      const rect = heroEl.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.35;
      const centerY = rect.top + rect.height * 0.35;
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.45)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 0.45)));
      const distFromCenter = Math.sqrt(normX * normX + normY * normY);

      if (rotateXTo && rotateYTo && translateZTo && xTo && yTo && nameEl) {
        rotateXTo(-normY * 7.5);
        rotateYTo(normX * 9.5);
        translateZTo(Math.max(0, (1 - distFromCenter * 0.45) * 8));
        xTo(normX * 4.5);
        yTo(normY * 3);

        const shadowX = (-normX * 8).toFixed(1);
        const shadowY = (-normY * 5 + 3).toFixed(1);
        nameEl.style.textShadow = `${shadowX}px ${shadowY}px 18px rgba(99, 102, 241, 0.22), ${shadowX}px ${shadowY}px 5px rgba(0, 0, 0, 0.5)`;
      }

      if (midRotateXTo && midRotateYTo && midTranslateZTo && midXTo && midYTo) {
        midRotateXTo(-normY * 2.2);
        midRotateYTo(normX * 2.8);
        midTranslateZTo(Math.max(0, (1 - distFromCenter * 0.45) * 2.4));
        midXTo(normX * 1.5);
        midYTo(normY * 1.0);
      }
    };

    const handlePointerLeave = () => {
      if (rotateXTo && rotateYTo && translateZTo && xTo && yTo && nameEl && gsapModule) {
        rotateXTo(0);
        rotateYTo(0);
        translateZTo(0);
        xTo(0);
        yTo(0);
        gsapModule.to(nameEl, {
          textShadow: '0px 0px 0px rgba(0,0,0,0)',
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
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

    const setupHover = (gsap: typeof import('gsap').default) => {
      if (!hasFineHover || prefersReducedMotion) return;

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

      heroEl.addEventListener('pointermove', handlePointerMove, { passive: true });
      heroEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    };

    const resetTransforms = () => {
      if (!gsapModule) return;
      if (nameEl) gsapModule.set(nameEl, { rotateX: 0, rotateY: 0, translateZ: 0, x: 0, y: 0, clearProps: 'all' });
      if (midgroundEl) {
        gsapModule.set(midgroundEl, { rotateX: 0, rotateY: 0, translateZ: 0, x: 0, y: 0, clearProps: 'all' });
      }
    };

    void import('gsap').then(({ default: gsap }) => {
      if (cancelled) return;
      gsapModule = gsap;

      if (!prefersReducedMotion) {
        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
          tl.fromTo(statusRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, 0)
            .fromTo(namePlaneRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.38 }, 0.06)
            .fromTo(headlineRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.12)
            .fromTo(descRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, 0.18)
            .fromTo(ctaRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, 0.26);
        }, heroRef);
      }

      setupHover(gsap);
    });

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) resetTransforms();
    };

    const handleHoverChange = (e: MediaQueryListEvent) => {
      hasFineHover = e.matches;
      if (!hasFineHover) resetTransforms();
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    hoverQuery.addEventListener('change', handleHoverChange);

    return () => {
      cancelled = true;
      ctx?.revert();
      heroEl.removeEventListener('pointermove', handlePointerMove);
      heroEl.removeEventListener('pointerleave', handlePointerLeave);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      hoverQuery.removeEventListener('change', handleHoverChange);
      resetTransforms();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-0 flex-col justify-center overflow-hidden bg-[#070b15] pt-24 pb-0 px-4 sm:min-h-[90vh] sm:pt-28 sm:pb-16 sm:px-6 lg:px-8 scroll-mt-20 md:scroll-mt-24 border-b border-white/5"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      <HeroVisualGrid containerRef={heroRef} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <div
              ref={statusRef}
              id="hero-status"
              className="mb-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1"
            >
              <p className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">
                WordPress <span aria-hidden="true">·</span> Shopify <span aria-hidden="true">·</span> Figma to production
              </p>
              <p className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs text-slate-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {PERSONAL_INFO.availability}
              </p>
            </div>

            <div className="space-y-5">
              <div
                className="inline-block"
                style={{ perspective: '800px', perspectiveOrigin: 'left center' }}
              >
                <h1
                  ref={namePlaneRef}
                  id="hero-name"
                  className="font-display text-3xl sm:text-5xl lg:text-[3.4rem] xl:text-6xl font-extrabold tracking-tight text-white leading-tight cursor-default select-text inline-block origin-left"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {PERSONAL_INFO.name}
                </h1>
              </div>

              <div
                ref={midgroundRef}
                className="origin-left"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div ref={headlineRef} id="hero-tagline">
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl font-bold text-slate-100 leading-snug max-w-2xl">
                    Pixel-perfect for users. <br className="hidden sm:inline" />
                    Editable for teams. <br className="hidden sm:inline" />
                    Maintainable for developers.
                  </h2>
                </div>
              </div>

              <p
                ref={descRef}
                id="hero-desc"
                className="font-sans text-sm sm:text-base text-slate-400 max-w-[38rem] leading-relaxed"
              >
                {PERSONAL_INFO.experienceSummary}
              </p>
            </div>

            <div
              ref={ctaRef}
              id="hero-cta"
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => scrollTo('featured-work')}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-sans text-sm font-bold text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors cursor-pointer"
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

          <div className="lg:col-span-5 flex justify-center lg:justify-end lg:pb-1">
            <AsciiArtCanvas
              src="/hero-portrait.jpg"
              label="ASCII portrait of Dmitry Bashkatov"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
