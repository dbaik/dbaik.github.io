import { Layers, Palette, Terminal, TrendingUp, type LucideIcon } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

const WHY_ME_ICONS: LucideIcon[] = [Palette, Layers, Terminal, TrendingUp];

export default function HowIWork() {
  return (
    <section
      id="why-me"
      className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 sm:mb-16 border-b border-white/10 pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-2 font-bold">
            <span>03 / WHY ME</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why teams hire me
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm sm:text-base text-slate-400">
            {PERSONAL_INFO.whyMeIntro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PERSONAL_INFO.whyMe.map((item, index) => {
            const Icon = WHY_ME_ICONS[index] ?? Palette;
            return (
              <div
                key={item.audience}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 sm:p-6"
              >
                <Icon size={20} className="mb-3 text-indigo-400" aria-hidden="true" />
                <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight leading-snug mb-2">
                  {item.audience}
                </h3>
                <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
                  {item.statement}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
