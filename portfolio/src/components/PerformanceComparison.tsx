import React from 'react';
import { 
  Zap, CheckCircle2, 
  Sparkles, AlertTriangle
} from 'lucide-react';
import { BENCHMARK_DATA } from '../data/portfolioData';

export default function PerformanceComparison() {
  return (
    <section id="performance" className="relative bg-[#070b15] py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5 scroll-mt-20 md:scroll-mt-24">
      {/* Ambient background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-emerald-400 font-mono text-[9px] tracking-widest uppercase mb-3">
            <Zap size={11} className="animate-pulse" />
            <span>MEASURABLE SPEED ROI</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Zero-Bloat Architecture
          </h2>
          <p className="mt-4 font-sans text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
            70% of your visitors are on mobile devices and won't wait for bloated themes. See how bespoke Gutenberg and clean semantic markup outperform generic agency templates.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Typical Agency Bloated Theme (Red / Warning Tone) */}
          <div className="lg:col-span-5 rounded-3xl border border-red-500/20 bg-slate-950/60 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-wider font-bold">
                  <AlertTriangle size={15} />
                  <span>Typical Agency Bloated Theme</span>
                </div>
                <span className="bg-red-500/10 border border-red-500/30 text-red-300 px-2.5 py-0.5 rounded-full font-mono text-[8px]">
                  FAILING VITALS
                </span>
              </div>

              {/* Bad Metric Display */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl sm:text-5xl font-black font-sans text-red-400">48</span>
                <span className="text-slate-500 font-mono text-sm">/ 100 PageSpeed</span>
              </div>

              <div className="space-y-4 font-sans text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/10 space-y-1">
                  <span className="font-mono text-[9px] text-red-300 font-bold uppercase block">42+ Active Plugins & Page Builders</span>
                  <p className="text-slate-400 font-light text-[11px]">Heavy Elementor / Divi frameworks outputting 15+ nested DIV layers and megabytes of unused render-blocking CSS.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/10 space-y-1">
                  <span className="font-mono text-[9px] text-red-300 font-bold uppercase block">4.6s Largest Contentful Paint</span>
                  <p className="text-slate-400 font-light text-[11px]">Unoptimized 4MB raw JPEGs, uncompressed web fonts, and chained JavaScript requests causing mobile drop-off.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/10 space-y-1">
                  <span className="font-mono text-[9px] text-red-300 font-bold uppercase block">High Cumulative Layout Shift (0.34)</span>
                  <p className="text-slate-400 font-light text-[11px]">Images jumping into view without explicit width/height dimensions, frustrating customers trying to tap buttons.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-slate-500 flex justify-between items-center">
              <span>ESTIMATED BOUNCE RATE: ~65%</span>
              <span className="text-red-400 font-bold">LOST CONVERSIONS</span>
            </div>
          </div>

          {/* RIGHT: Dmitry's Custom High-Performance Architecture (Emerald / Optimal Tone) */}
          <div className="lg:col-span-7 rounded-3xl border border-emerald-500/30 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                  <CheckCircle2 size={16} />
                  <span>Dmitry's Bespoke Performance Theme</span>
                </div>
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-0.5 rounded-full font-mono text-[8px] font-bold animate-pulse">
                  100/100 PASSED
                </span>
              </div>

              {/* Perfect Metric Display */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl sm:text-5xl font-black font-sans text-emerald-400">99+</span>
                <span className="text-slate-400 font-mono text-sm">/ 100 Core Web Vitals</span>
              </div>

              {/* Benchmarks Comparison Matrix */}
              <div className="space-y-3">
                {BENCHMARK_DATA.map((item) => (
                  <div 
                    key={item.metric}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <span className="font-sans text-xs font-semibold text-white block">
                        {item.metric}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400">
                        Bloated: <span className="text-red-400">{item.standardTheme}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        {item.dmitryArchitecture}
                      </span>
                      <span className="hidden sm:inline font-mono text-[9px] text-indigo-300 font-bold">
                        {item.difference}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[9px] text-emerald-300 flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sparkles size={11} />
                <span>CLEAN CODE GUARANTEE: NEVER PAY AN AGENCY RETAINER FOR A ONE-HOUR FIX</span>
              </span>
              <span className="font-bold">+38% ROI LIFT</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
