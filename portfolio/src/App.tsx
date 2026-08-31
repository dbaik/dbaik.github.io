import type Lenis from 'lenis';
import { lazy, Suspense, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import MarqueeStrip from './components/MarqueeStrip';
import Footer from './components/Footer';

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

export default function App() {
  useEffect(() => {
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
        <Suspense fallback={<SectionFallback />}>
          <ProjectsShowcase />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <HowIWork />
        </Suspense>
        <MarqueeStrip items={MARQUEE_ITEMS} />
        <Suspense fallback={<SectionFallback />}>
          <ScrollStoryCanvas />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ExperienceTimeline />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <SkillsRadar />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
