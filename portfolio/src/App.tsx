import type Lenis from 'lenis';
import { lazy, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import MarqueeStrip from './components/MarqueeStrip';
import Footer from './components/Footer';
import LazyWhenVisible from './components/LazyWhenVisible';

const ProjectsShowcase = lazy(() => import('./components/ProjectsShowcase'));
const HowIWork = lazy(() => import('./components/HowIWork'));
const ScrollStoryCanvas = lazy(() => import('./components/ScrollStoryCanvas'));
const ExperienceTimeline = lazy(() => import('./components/ExperienceTimeline'));
const SkillsRadar = lazy(() => import('./components/SkillsRadar'));
const ContactSection = lazy(() => import('./components/ContactSection'));

function SectionFallback() {
  return <div className="min-h-[16rem]" aria-hidden="true" />;
}

const MARQUEE_ITEMS = [
  'WordPress',
  'Shopify',
  'Gutenberg',
  'ACF',
  'Liquid',
  'WooCommerce',
  'Tailwind CSS',
  'Core Web Vitals',
  'Technical SEO',
  'GA4',
  'Figma',
  'GSAP',
];

function prefersCoarsePointer(): boolean {
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches)
  );
}

export default function App() {
  useEffect(() => {
    // Lenis adds little on touch browsers and competes with the critical path on mobile lab tests.
    if (prefersCoarsePointer() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let lenis: Lenis | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    const stopLenis = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lenis?.stop();
    };

    const startLenis = () => {
      if (document.hidden) return;
      lenis?.start();
      if (rafId === null) {
        rafId = requestAnimationFrame(raf);
      }
    };

    const boot = () => {
      void import('lenis')
        .then(({ default: Lenis }) => {
          if (cancelled) return;

          try {
            lenis = new Lenis({
              duration: 1.1,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              gestureOrientation: 'vertical',
              smoothWheel: true,
            });

            (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;
            startLenis();
          } catch (e) {
            console.warn('Smooth scroll fallback:', e);
          }
        })
        .catch((e) => {
          console.warn('Smooth scroll fallback:', e);
        });
    };

    // Defer past first paint so hero CSS/JS win the network.
    let cancelBoot: () => void;
    const idleWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(boot, { timeout: 1800 });
      cancelBoot = () => idleWindow.cancelIdleCallback?.(idleId);
    } else {
      const timeoutId = window.setTimeout(boot, 200);
      cancelBoot = () => window.clearTimeout(timeoutId);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLenis();
      } else {
        startLenis();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      cancelBoot();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopLenis();
      (window as unknown as { __lenis?: Lenis | null }).__lenis = null;
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070b15] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="page-ambient-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_30%,transparent_100%)]" />
      </div>

      <CustomCursor />
      <Header />

      <main className="relative z-10">
        <Hero />
        <LazyWhenVisible fallback={<SectionFallback />} anchors="featured-work archive">
          <ProjectsShowcase />
        </LazyWhenVisible>
        <LazyWhenVisible fallback={<SectionFallback />} anchors="how-i-work">
          <HowIWork />
        </LazyWhenVisible>
        <MarqueeStrip items={MARQUEE_ITEMS} />
        <LazyWhenVisible fallback={<SectionFallback />} anchors="scroll-story">
          <ScrollStoryCanvas />
        </LazyWhenVisible>
        <LazyWhenVisible fallback={<SectionFallback />} anchors="experience">
          <ExperienceTimeline />
        </LazyWhenVisible>
        <LazyWhenVisible fallback={<SectionFallback />} anchors="skills">
          <SkillsRadar />
        </LazyWhenVisible>
        <LazyWhenVisible fallback={<SectionFallback />} anchors="contact">
          <ContactSection />
        </LazyWhenVisible>
      </main>

      <Footer />
    </div>
  );
}
