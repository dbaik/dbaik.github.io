import { motion } from 'motion/react';
import { EXPERIENCE_DATA } from '../data/portfolioData';

export default function ExperienceTimeline() {
  return (
    <section 
      id="experience" 
      className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-16 border-b border-white/10 pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-2 font-bold">
            <span>04 / EXPERIENCE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Professional Experience
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm sm:text-base text-slate-400">
            Independent contractor since 2017. 15+ years in frontend across WordPress and Shopify.
          </p>
        </div>

        <div className="space-y-6 relative before:absolute before:top-3 before:bottom-3 before:left-3 sm:before:left-4 before:-translate-x-1/2 before:w-px before:bg-[var(--line)]">
          {EXPERIENCE_DATA.slice(0, 2).map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="relative pl-9 sm:pl-11 group"
              >
                <div className="absolute left-3 sm:left-4 top-5 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-indigo-400 bg-[#070b15] z-10" />

                <div className="rounded-xl border border-white/5 bg-slate-950/40 backdrop-blur-sm group-hover:border-white/15 transition-all p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-2">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h3 className="font-display font-bold text-white group-hover:text-indigo-300 transition-colors text-lg sm:text-xl">
                        {exp.company}
                      </h3>
                      <span className="text-slate-400/60">·</span>
                      <span className="font-mono text-xs sm:text-sm font-semibold text-indigo-400">
                        {exp.role}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-400 shrink-0">
                      {exp.period}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>

                  <p className="font-sans text-sm text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.highlights.length > 0 && (
                    <ul className="mt-3 space-y-1.5 pt-2 border-t border-white/5">
                      {exp.highlights.map((hl) => (
                        <li key={hl} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-indigo-400 mt-0.5">›</span>
                          <span className="leading-relaxed">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
          ))}
        </div>

        <details className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40">
          <summary className="cursor-pointer list-none px-5 py-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-2xl">
            Earlier roles
          </summary>
          <div className="space-y-3 px-5 pb-5">
            {EXPERIENCE_DATA.slice(2).map((exp) => (
              <div key={exp.id} className="border-t border-white/5 pt-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <p className="font-display text-sm font-bold text-white">
                    {exp.company} <span className="text-slate-500">·</span>{' '}
                    <span className="font-mono text-xs font-semibold text-indigo-400">{exp.role}</span>
                  </p>
                  <p className="font-mono text-xs text-slate-400">
                    {exp.period}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                </div>
                <p className="mt-1 font-sans text-sm text-slate-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </details>

        <p className="mt-10 pt-8 border-t border-white/10 font-sans text-sm text-slate-400 leading-relaxed">
          Formal web-design training (2009) and an engineering degree, applied to production frontend work since then.
        </p>

      </div>
    </section>
  );
}
