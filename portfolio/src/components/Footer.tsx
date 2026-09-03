import React from 'react';
import { ArrowUp, Github, Linkedin } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { scrollToSection } from '../utils/scroll';
import FanRain from './FanRain';

export default function Footer() {
  const handleBackToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection('#hero');
  };

  return (
    <footer className="bg-[#050811] py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-slate-400">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand identity: Name & Role */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="font-display text-sm font-semibold text-white tracking-tight">
            {PERSONAL_INFO.name}
          </span>
          <span className="font-mono text-xs text-slate-400 mt-0.5">
            {PERSONAL_INFO.title}
          </span>
        </div>

        {/* Utilities: Copyright & Back to Top */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href={PERSONAL_INFO.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            aria-label="Telegram"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="currentColor"
            >
              <path d="M21.8 4.2 18.4 20.3c-.26 1.14-.94 1.42-1.9.88l-5.26-3.88-2.54 2.44c-.28.28-.51.51-1.05.51l.38-5.36 9.76-8.82c.42-.38-.1-.58-.66-.21L6.4 12.7 1.2 11.06c-1.14-.36-1.16-1.14.24-1.7L20.3 3.1c.94-.36 1.76.21 1.5 1.1Z" />
            </svg>
          </a>
          <FanRain />
          <span className="text-slate-400 text-xs font-mono">
            © {new Date().getFullYear()}
          </span>

          <a
            href="#hero"
            onClick={handleBackToTop}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            title="Back to Top"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
}
