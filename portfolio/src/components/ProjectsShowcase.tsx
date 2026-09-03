import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, ExternalLink, X, 
  CheckCircle2
} from 'lucide-react';
import { FEATURED_PROJECT_IDS, PROJECTS_DATA } from '../data/portfolioData';
import { COVER_IMAGES } from '../data/coverImages';
import { Project } from '../types';
import { BrowserFrame } from './BrowserFrame';
import { scrollToSection } from '../utils/scroll';

function pageSpeedInsightsUrl(url: string): string {
  return `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`;
}

function projectCoverImage(project: Project) {
  return project.coverKey ? COVER_IMAGES[project.coverKey] : undefined;
}

export default function ProjectsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  const featuredProjects = FEATURED_PROJECT_IDS
    .map((id) => PROJECTS_DATA.find((project) => project.id === id))
    .filter((project): project is Project => project !== undefined);
  
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

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === '#archive') {
        setArchiveOpen(true);
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const handleCloseModal = () => {
    setActiveModalProject(null);
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
      triggerButtonRef.current = null;
    }
  };

  return (
    <>
      {/* 1. FEATURED WORK SECTION */}
      <section 
        id="featured-work" 
        className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
      >
        <div className="mx-auto max-w-6xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 border-b border-white/10 pb-6 sm:pb-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-2 font-bold">
                <span>01 / WORK</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Selected Case Studies
              </h2>
            </div>
            <p className="max-w-md font-sans text-xs sm:text-sm text-slate-400 leading-relaxed">
              Three projects. The technical problem, what I owned, and the system that shipped.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
            {featuredProjects.map((project, idx) => {
              const cover = projectCoverImage(project);

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.06, ease: 'easeOut' }}
                  className="group/card relative flex flex-col rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 backdrop-blur-xl hover:border-white/20 transition-colors shadow-lg overflow-hidden"
                >
                  {cover ? (
                    <div className="mb-4">
                      <BrowserFrame
                        src={cover}
                        alt={`${project.title} (${project.domain}) live production website`}
                        domain={project.domain}
                        onClick={(e) => handleOpenModal(project, e)}
                        className="cursor-pointer"
                      />
                    </div>
                  ) : null}

                  <p className="font-mono text-[10px] uppercase font-bold tracking-wider text-indigo-400 mb-2">
                    {project.title}
                  </p>

                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug mb-4">
                    {project.caseHeadline ?? project.description}
                  </h3>

                  {project.challenge ? (
                    <p className="font-sans text-sm text-slate-400 leading-relaxed mb-2">
                      <span className="font-semibold text-slate-300">Challenge. </span>
                      {project.challenge}
                    </p>
                  ) : null}

                  {project.outcome ? (
                    <p className="font-sans text-sm text-slate-400 leading-relaxed mb-5">
                      <span className="font-semibold text-slate-300">Outcome. </span>
                      {project.outcome}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={(e) => handleOpenModal(project, e)}
                    className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-indigo-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
                  >
                    <span>View case</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </button>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={() => scrollToSection('#contact')}
              className="font-sans text-sm font-semibold text-white hover:text-indigo-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
            >
              Have a similar project?
            </button>
            <a
              href="#archive"
              onClick={(e) => {
                e.preventDefault();
                setArchiveOpen(true);
                scrollToSection('#archive');
              }}
              className="font-mono text-xs text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
            >
              More work →
            </a>
          </div>

        </div>
      </section>

      <section className="relative bg-[#070b15] pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="mx-auto max-w-6xl">
          <details
            id="archive"
            className="group rounded-2xl border border-white/10 bg-slate-950/40 scroll-mt-24"
            open={archiveOpen}
            onToggle={(event) => setArchiveOpen(event.currentTarget.open)}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-display text-lg font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-2xl">
              <span>More work</span>
              <span className="font-mono text-xs font-semibold text-slate-400 group-open:hidden">Show archive</span>
              <span className="font-mono text-xs font-semibold text-slate-400 hidden group-open:inline">Hide archive</span>
            </summary>

            <div className="px-5 pb-6">
          <search className="flex flex-wrap gap-1.5 mb-6" aria-label="Filter archived projects">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
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
          </search>

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
                      <span className="font-mono text-xs text-slate-400 block mt-0.5">
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
                    <span className="font-mono text-xs text-slate-400 block mt-0.5">
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
          </details>
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
                className="relative w-full max-w-2xl sm:max-w-3xl rounded-2xl border p-6 sm:p-8 shadow-2xl z-10 my-auto max-h-[calc(100vh-5.5rem)] sm:max-h-[calc(100vh-6.5rem)] overflow-y-auto overscroll-contain isolate outline-none focus:outline-none [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {/* Close Button */}
                <button
                  ref={modalCloseBtnRef}
                  onClick={handleCloseModal}
                  className="project-modal-close absolute top-5 right-5 h-8 w-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400/40 z-20"
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
                      className="font-mono text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
                    >
                      <span>{activeModalProject.domain}</span>
                      <ArrowUpRight size={12} />
                    </a>
                  </div>

                  {activeModalProject.caseHeadline ? (
                    <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
                      {activeModalProject.caseHeadline}
                    </p>
                  ) : (
                    <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
                      {activeModalProject.description}
                    </p>
                  )}

                  {projectCoverImage(activeModalProject) && (
                    <div className="mb-6">
                      <BrowserFrame
                        src={projectCoverImage(activeModalProject)!}
                        alt={`${activeModalProject.title} live screenshot`}
                        domain={activeModalProject.domain}
                        url={activeModalProject.url}
                      />
                    </div>
                  )}

                  {activeModalProject.challenge ? (
                    <div className="mb-5">
                      <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                        Challenge
                      </h4>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed">
                        {activeModalProject.challenge}
                      </p>
                    </div>
                  ) : null}

                  {activeModalProject.contribution ? (
                    <div className="mb-5">
                      <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                        What I owned
                      </h4>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed">
                        {activeModalProject.contribution}
                      </p>
                    </div>
                  ) : null}

                  <div className="mb-6">
                    <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                      What I built
                    </h4>
                    <ul className="space-y-2.5">
                      {(activeModalProject.caseHeadline
                        ? activeModalProject.responsibilities.slice(0, 3)
                        : activeModalProject.responsibilities
                      ).map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <CheckCircle2 size={15} className="text-indigo-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {activeModalProject.outcome ? (
                    <div className="mb-6">
                      <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                        Outcome
                      </h4>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed">
                        {activeModalProject.outcome}
                      </p>
                    </div>
                  ) : null}

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
                      TECHNOLOGIES USED
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModalProject.technologies.map((tech) => (
                        <span key={tech} className="project-modal-chip rounded-md border px-2.5 py-1 font-mono text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={activeModalProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-sans text-sm font-bold text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors"
                      >
                        <span>Visit live site</span>
                        <ExternalLink size={14} />
                      </a>
                      <a
                        href={pageSpeedInsightsUrl(activeModalProject.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-colors"
                      >
                        <span>PageSpeed Insights</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    <button
                      type="button"
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
