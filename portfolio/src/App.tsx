import { useEffect } from 'react';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectsShowcase from './components/ProjectsShowcase';
import HowIWork from './components/HowIWork';
import ScrollStoryCanvas from './components/ScrollStoryCanvas';
import ExperienceTimeline from './components/ExperienceTimeline';
import SkillsRadar from './components/SkillsRadar';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scrolling for refined scroll feel
    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    try {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      (window as unknown as { __lenis?: Lenis | null }).__lenis = lenis;

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Smooth scroll fallback:', e);
    }

    // Clean up on unmount
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      (window as unknown as { __lenis?: Lenis | null }).__lenis = null;
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070b15] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Background Architectural Sub-grid */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_30%,transparent_100%)]" />
      </div>

      {/* Interactive custom cursor */}
      <CustomCursor />

      {/* Primary Header & Navigation */}
      <Header />

      {/* Main Sections */}
      <main className="relative z-10">
        <Hero />
        <ProjectsShowcase />
        <HowIWork />
        <ScrollStoryCanvas />
        <ExperienceTimeline />
        <SkillsRadar />
        <ContactSection />
      </main>

      {/* Footer and Social Links */}
      <Footer />
    </div>
  );
}
