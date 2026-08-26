import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';

export default function HowIWork() {
  return (
    <section 
      id="how-i-work" 
      className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-16 border-b border-white/10 pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-2 font-bold">
            <span>03 / CORE PRINCIPLES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How I Build
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm sm:text-base text-slate-400">
            Three principles that guide how I build production WordPress and Shopify projects.
          </p>
        </div>

        {/* 3 Editorial Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {PERSONAL_INFO.howIWork.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`py-8 md:py-0 first:pt-0 last:pb-0 ${
                index === 0 
                  ? 'md:pr-8 lg:pr-10' 
                  : index === 1 
                    ? 'md:px-8 lg:px-10' 
                    : 'md:pl-8 lg:pl-10'
              }`}
            >
              <div className="font-mono text-2xl sm:text-3xl font-bold text-indigo-400 mb-3 sm:mb-4">
                {item.number}
              </div>
              
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                {item.title}
              </h3>

              <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
