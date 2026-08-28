import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';

export default function SkillsRadar() {
  const skillCategories = [
    {
      group: 'CMS & E-Commerce',
      lead: [
        'WordPress',
        'Gutenberg Blocks',
        'ACF Pro',
        'Elementor',
        'Shopify Liquid',
        'Polylang'
      ]
    },
    {
      group: 'Frontend & Architecture',
      lead: [
        'HTML5 / Semantic Markup',
        'CSS3 / SCSS',
        'JavaScript (ES6+)',
        'TypeScript',
        'React & Next.js',
        'AJAX / REST'
      ]
    },
    {
      group: 'Motion & Web Vitals',
      lead: [
        'GSAP & ScrollTrigger',
        'Micro-Interactions',
        'Core Web Vitals · LCP · CLS · INP'
      ]
    },
    {
      group: 'Backend & Tooling',
      lead: [
        'PHP & MySQL',
        'Git & GitHub',
        'Vite & Webpack',
        'WP Engine & Cloudways',
        'Figma Design Handoff'
      ]
    }
  ];

  return (
    <section 
      id="skills" 
      className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 border-b border-white/10 pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-2 font-bold">
            <span>06 / TOOLKIT & EXPERTISE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Technical Stack
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm sm:text-base text-slate-400">
            A production-proven technology stack built over 15+ years of delivering custom commercial web solutions.
          </p>
        </div>

        {/* Clean Editorial Grouped Rows */}
        <div className="divide-y divide-white/10 border-b border-white/10">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.group}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="py-5 sm:py-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-8"
            >
              {/* Category Column */}
              <div className="md:w-64 lg:w-72 shrink-0">
                <h3 className="font-mono text-xs sm:text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  {cat.group}
                </h3>
              </div>

              {/* Technologies */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white font-display text-sm sm:text-base font-semibold leading-relaxed">
                  {cat.lead.map((tech, i) => (
                    <span key={tech} className="inline-flex items-center gap-3">
                      <span className="hover:text-indigo-300 transition-colors">{tech}</span>
                      {i < cat.lead.length - 1 && (
                        <span className="text-slate-600 font-normal select-none">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Working Languages */}
        <div className="mt-10 max-w-lg">
          <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
            WORKING LANGUAGES
          </h4>
          <ul className="font-sans text-sm text-slate-300">
            {PERSONAL_INFO.languages.map((lang) => (
              <li
                key={lang.name}
                className="flex flex-col gap-0.5 border-b border-white/5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="font-bold text-white shrink-0">{lang.name}</span>
                <span className="text-slate-400 text-xs sm:text-sm sm:text-right leading-relaxed">
                  {lang.level}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
