interface MarqueeStripProps {
  items: string[];
}

function MarqueeGroup({ items, dup }: { items: string[]; dup?: boolean }) {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span
          key={dup ? `${item}-dup` : item}
          className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8"
        >
          <span>{item}</span>
          <span className="text-indigo-400/80">◆</span>
        </span>
      ))}
    </div>
  );
}

export default function MarqueeStrip({ items }: MarqueeStripProps) {
  return (
    <div className="relative border-b border-white/10 bg-[#070b15] overflow-hidden">
      <p className="sr-only">{items.join(', ')}</p>
      <div className="marquee-fade-l pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20" />
      <div className="marquee-fade-r pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20" />
      <div
        className="marquee-track flex w-max items-center py-3 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-slate-400"
        aria-hidden="true"
      >
        <MarqueeGroup items={items} />
        <MarqueeGroup items={items} dup />
      </div>
    </div>
  );
}
