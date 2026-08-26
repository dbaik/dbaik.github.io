import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, ExternalLink, X, 
  CheckCircle2, Info
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { Project } from '../types';
import { BrowserFrame } from './BrowserFrame';

export default function ProjectsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  const featuredProjects = PROJECTS_DATA.filter((p) => p.featured);
  
  const archiveProjects = selectedCategory === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  // Dynamically calculate category counts directly from source data
  const totalCount = PROJECTS_DATA.length;
  const wpCount = PROJECTS_DATA.filter((p) => p.category === 'wordpress').length;
  const shopifyCount = PROJECTS_DATA.filter((p) => p.category === 'shopify').length;

  const categories = [
    { id: 'all', label: `All Builds (${totalCount})` },
    { id: 'wordpress', label: `WordPress & Gutenberg (${wpCount})` },
    { id: 'shopify', label: `Shopify & Liquid (${shopifyCount})` },
  ];

  // Modal accessibility: Escape key listener, scroll locking, focus trap, and focus restoration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeModalProject) return;

      if (e.key === 'Escape') {
        handleCloseModal();
        return;
      }

      if (e.key === 'Tab') {
        const modalEl = document.querySelector('[role="dialog"]');
        if (!modalEl) return;
        const focusableElements = modalEl.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (activeModalProject) {
      // 1. Lock document and body scroll
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // 2. Pause Lenis smooth scroll instance so background page cannot scroll
      const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } | null }).__lenis;
      lenis?.stop();

      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => {
        // Focus modal container without showing focus-visible ring on close button
        const modalBox = document.getElementById('project-detail-modal-box');
        modalBox?.focus({ preventScroll: true });
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalBodyOverflow || '';
        document.documentElement.style.overflow = originalHtmlOverflow || '';
        lenis?.start();
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeModalProject]);

  const handleOpenModal = (project: Project, e?: React.MouseEvent) => {
    if (e) {
      triggerButtonRef.current = e.currentTarget as HTMLElement;
    }
    setActiveModalProject(project);
  };

  const handleCloseModal = () => {
    setActiveModalProject(null);
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
      triggerButtonRef.current = null;
    }
  };

  const toggleRevealCard = (projectId: string) => {
    setRevealedCardId((prev) => (prev === projectId ? null : projectId));
  };

  return (
    <>
      {/* 1. FEATURED WORK SECTION */}
      <section 
        id="featured-work" 
        className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
      >
        <div className="mx-auto max-w-6xl">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 border-b border-white/10 pb-6 sm:pb-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-2 font-bold">
                <span>01 / SELECTED WORK</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Featured Projects
              </h2>
            </div>
            <p className="max-w-md font-sans text-xs sm:text-sm text-slate-400 leading-relaxed">
              Selected production work across custom WordPress, Gutenberg, and Shopify builds. Hover or tap any project to reveal technical details.
            </p>
          </div>

          {/* Progressive Disclosure Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {featuredProjects.map((project, idx) => {
              const isRevealed = revealedCardId === project.id;

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group/card relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5 sm:p-6 backdrop-blur-xl hover:border-white/20 transition-all shadow-lg overflow-hidden"
                >
                  {/* Default Top Bar: Short Eyebrow + Project Title */}
                  <div className="flex items-start justify-between gap-3 mb-3.5 sm:mb-4">
                    <div className="min-w-0 flex-1">
                      {/* Short Category Eyebrow */}
                      <span className="font-mono text-xs uppercase font-bold tracking-wider text-indigo-400 block mb-1">
                        {project.categoryLabel}
                      </span>

                      {/* Project Title with External Arrow Cue - Arrow strictly shows only on title hover/focus */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/title inline-flex items-center gap-1.5 font-display text-xl sm:text-2xl font-extrabold text-white hover:text-indigo-300 focus-visible:text-indigo-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded-lg leading-snug"
                        title={`Visit ${project.title} (${project.domain})`}
                      >
                        <span className="break-words">{project.title}</span>
                        <ArrowUpRight 
                          size={18} 
                          className="text-indigo-400 opacity-0 -translate-x-1 translate-y-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:translate-y-0 group-focus-visible/title:opacity-100 group-focus-visible/title:translate-x-0 group-focus-visible/title:translate-y-0 transition-all duration-200 shrink-0 motion-reduce:transition-none motion-reduce:transform-none" 
                          aria-hidden="true"
                        />
                      </a>
                    </div>

                    {/* Mobile Tap Toggle Indicator */}
                    <button
                      type="button"
                      onClick={() => toggleRevealCard(project.id)}
                      className="lg:hidden p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none cursor-pointer shrink-0"
                      aria-label={isRevealed ? `Hide details for ${project.title}` : `Show technical details for ${project.title}`}
                      title={isRevealed ? "Hide details" : "Technical details"}
                    >
                      <Info size={15} className={isRevealed ? "text-indigo-400" : ""} />
                    </button>
                  </div>

                  {/* Visual Work First: BrowserFrame with Progressive Disclosure Overlay */}
                  {project.coverImage && (
                    <div className="relative mt-1">
                      <BrowserFrame
                        src={project.coverImage}
                        alt={`${project.title} (${project.domain}) live production website`}
                        domain={project.domain}
                        onClick={() => toggleRevealCard(project.id)}
                        className="cursor-pointer"
                      >
                        {/* Progressive Disclosure Information Layer (Revealed strictly on BrowserFrame interaction) */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-950/40 backdrop-blur-[2px] p-5 sm:p-6 flex flex-col justify-end gap-3.5 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 rounded-b-[11px] ${
                            isRevealed
                              ? 'opacity-100 translate-y-0 pointer-events-auto'
                              : 'opacity-0 translate-y-2 pointer-events-none group-hover/browser:opacity-100 group-hover/browser:translate-y-0 group-hover/browser:pointer-events-auto group-focus-within/browser:opacity-100 group-focus-within/browser:translate-y-0 group-focus-within/browser:pointer-events-auto'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Short Description */}
                          <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>

                          {/* Tech Stack & Action Links */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                            {/* Technology Stack (3-4 items) */}
                            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-300">
                              {project.technologies.slice(0, 4).map((tech, i) => (
                                <span key={tech} className="inline-flex items-center gap-1.5">
                                  <span>{tech}</span>
                                  {i < Math.min(project.technologies.length, 4) - 1 && (
                                    <span className="text-slate-600 font-normal select-none">·</span>
                                  )}
                                </span>
                              ))}
                            </div>

                            {/* Action Links */}
                            <div className="flex items-center gap-2 shrink-0 justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenModal(project, e);
                                }}
                                className="rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 font-mono text-xs font-semibold text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                              >
                                Case Study
                              </button>
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 font-mono text-xs font-semibold inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                                title={`Visit ${project.title} live site`}
                              >
                                <span>Visit</span>
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </BrowserFrame>
                    </div>
                  )}

                </motion.article>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. SELECTED PROJECTS ARCHIVE (COMPACT EDITORIAL INDEX) */}
      <section 
        id="archive" 
        className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
      >
        <div className="mx-auto max-w-6xl">
          
          {/* Section Header with Category Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-1 font-bold">
                <span>02 / PROJECT ARCHIVE</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Selected Projects Archive
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
                    selectedCategory === cat.id
                      ? 'bg-white text-slate-950 font-bold'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop & Tablet Table (sm:block) */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-white/10 bg-white/5 font-mono text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="py-3.5 px-4 font-bold">Project</th>
                  <th scope="col" className="py-3.5 px-4 font-bold">Platform</th>
                  <th scope="col" className="py-3.5 px-4 font-bold hidden md:table-cell">Key Contribution</th>
                  <th scope="col" className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {archiveProjects.map((proj) => (
                  <tr 
                    key={proj.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* Title + Domain */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={(e) => handleOpenModal(proj, e)}
                        className="font-display text-sm font-bold text-white group-hover:text-indigo-300 text-left transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded block"
                      >
                        {proj.title}
                      </button>
                      <span className="font-mono text-xs text-slate-500 block mt-0.5">
                        {proj.domain}
                      </span>
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                      {proj.categoryLabel}
                    </td>

                    {/* Key Highlight */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-300 text-sm leading-relaxed">
                      {proj.highlights[0] ? proj.highlights[0].value : proj.description}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={(e) => handleOpenModal(proj, e)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-all cursor-pointer"
                        >
                          Details
                        </button>
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors"
                          title={`Visit ${proj.title} live site`}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Purpose-Built Scannable Cards (sm:hidden) */}
          <div className="space-y-3 sm:hidden">
            {archiveProjects.map((proj) => (
              <div 
                key={proj.id} 
                className="rounded-xl border border-white/10 bg-slate-950/60 p-4 space-y-2 backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <button 
                      onClick={(e) => handleOpenModal(proj, e)}
                      className="font-display text-base font-bold text-white text-left hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded transition-colors cursor-pointer"
                    >
                      {proj.title}
                    </button>
                    <span className="font-mono text-xs text-slate-500 block mt-0.5">
                      {proj.domain}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded shrink-0">
                    {proj.category === 'wordpress' ? 'WordPress' : 'Shopify'}
                  </span>
                </div>

                <p className="font-sans text-sm text-slate-300 leading-relaxed">
                  {proj.highlights[0] ? proj.highlights[0].value : proj.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={(e) => handleOpenModal(proj, e)}
                    className="font-mono text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 py-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
                  >
                    <span>Details →</span>
                  </button>
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 py-1 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
                  >
                    <span>Visit ↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. CASE STUDY DETAIL MODAL (Positioned below fixed header z-50, header remains visible) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeModalProject && (
            <div 
              className="fixed inset-0 top-14 sm:top-16 z-40 flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-project-title"
              data-lenis-prevent="true"
            >
              {/* Backdrop (under header) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer z-0"
              />

              {/* Modal Box */}
              <motion.div
                id="project-detail-modal-box"
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                data-lenis-prevent="true"
                className="relative w-full max-w-2xl sm:max-w-3xl rounded-2xl border border-white/15 bg-slate-950 p-6 sm:p-8 shadow-2xl z-10 my-auto max-h-[calc(100vh-5.5rem)] sm:max-h-[calc(100vh-6.5rem)] overflow-y-auto overscroll-contain isolate outline-none focus:outline-none [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/25"
              >
                {/* Close Button */}
                <button
                  ref={modalCloseBtnRef}
                  onClick={handleCloseModal}
                  className="absolute top-5 right-5 h-8 w-8 rounded-lg border border-white/10 bg-slate-900/90 sm:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 z-20"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>

                {/* Modal Content */}
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    {activeModalProject.categoryLabel}
                  </span>

                  <div className="flex flex-wrap items-baseline gap-3 mt-1 mb-4">
                    <h3 id="modal-project-title" className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      {activeModalProject.title}
                    </h3>
                    <a
                      href={activeModalProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
                    >
                      <span>{activeModalProject.domain}</span>
                      <ArrowUpRight size={12} />
                    </a>
                  </div>

                  <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
                    {activeModalProject.description}
                  </p>

                  {/* Original Production Screenshot Preview */}
                  {activeModalProject.coverImage && (
                    <div className="mb-6">
                      <BrowserFrame
                        src={activeModalProject.coverImage}
                        alt={`${activeModalProject.title} live screenshot`}
                        domain={activeModalProject.domain}
                        url={activeModalProject.url}
                      />
                    </div>
                  )}

                  {/* Key Responsibilities */}
                  <div className="mb-6">
                    <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                      WHAT I BUILT & DELIVERED
                    </h4>
                    <ul className="space-y-2.5">
                      {activeModalProject.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                          <CheckCircle2 size={15} className="text-indigo-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
                      TECHNOLOGIES USED
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModalProject.technologies.map((tech) => (
                        <span key={tech} className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 font-mono text-xs text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={activeModalProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-sans text-sm font-bold text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink size={14} />
                    </a>

                    <button
                      onClick={handleCloseModal}
                      className="font-mono text-xs text-slate-400 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded px-2 py-1"
                    >
                      Close
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
