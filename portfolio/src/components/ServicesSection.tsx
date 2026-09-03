import { SERVICES } from '../data/portfolioData';
import { scrollToContactWithType } from '../utils/scroll';

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-[#070b15] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 sm:mb-14 border-b border-white/10 pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-indigo-400 uppercase tracking-widest mb-2 font-bold">
            <span>02 / SERVICES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            What you can hire me for
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm sm:text-base text-[var(--text-secondary)]">
            Senior frontend execution that fits into your team and ships cleanly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-slate-950/60 p-5 sm:p-6 backdrop-blur-xl"
            >
              <h3 className="font-display text-xl font-bold text-white tracking-tight leading-snug mb-3">
                {service.title}
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed mb-4">
                {service.description}
              </p>
              <ul className="mb-5 space-y-1.5">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-indigo-400 mt-0.5" aria-hidden="true">›</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => scrollToContactWithType(service.projectType)}
                className="mt-auto inline-flex items-center gap-1 font-mono text-xs font-semibold text-indigo-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
              >
                <span>{service.ctaLabel}</span>
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
