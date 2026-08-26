import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { EXPERIENCE_DATA, PERSONAL_INFO } from '../data/portfolioData';

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
            <span>05 / CAREER & TRACK RECORD</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Professional Experience
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm sm:text-base text-slate-400">
            15+ years of continuous frontend development across agencies, remote product teams, and high-scale production client builds.
          </p>
        </div>

        {/* Compact Clean Editorial Timeline */}
        <div className="space-y-6 relative before:absolute before:top-3 before:bottom-3 before:left-3 sm:before:left-4 before:-translate-x-1/2 before:w-[1px] before:bg-white/10">
          {EXPERIENCE_DATA.map((exp, idx) => {
            const isRecent = idx < 2;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="relative pl-9 sm:pl-11 group"
              >
                {/* Timeline Marker Dot */}
                <div 
                  className={`absolute left-3 sm:left-4 top-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-[#070b15] transition-all z-10 ${
                    isRecent 
                      ? 'h-3.5 w-3.5 border-indigo-400' 
                      : 'h-2.5 w-2.5 border-slate-600 group-hover:border-slate-400'
                  }`} 
                />

                <div className={`rounded-xl border border-white/5 bg-slate-950/40 backdrop-blur-sm group-hover:border-white/15 transition-all ${
                  isRecent ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
                }`}>
                  {/* Header row: Company, Role, Period */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-2">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h3 className={`font-display font-bold text-white group-hover:text-indigo-300 transition-colors ${
                        isRecent ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                      }`}>
                        {exp.company}
                      </h3>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono text-xs sm:text-sm font-semibold text-indigo-400">
                        {exp.role}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-400 shrink-0">
                      {exp.period}
                    </div>
                  </div>

                  {/* Scope description */}
                  <p className="font-sans text-sm text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Highlights (only on recent major positions to keep older roles compact) */}
                  {isRecent && exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-3 space-y-1.5 pt-2 border-t border-white/5">
                      {exp.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-indigo-400 mt-0.5">›</span>
                          <span className="leading-relaxed">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Education & Certificates */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h3 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-6 flex items-center gap-2">
            <GraduationCap size={16} className="text-indigo-400" />
            <span>Education & Certificates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERSONAL_INFO.education.map((edu, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-slate-950/40 p-5">
                <div className="font-display text-sm font-bold text-white">{edu.institution}</div>
                <div className="font-sans text-xs sm:text-sm text-indigo-400 font-medium mt-0.5">{edu.degree}</div>
                <div className="font-mono text-xs text-slate-500 mt-2">{edu.period}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
