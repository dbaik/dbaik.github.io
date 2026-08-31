import { useEffect, useId, useState } from 'react';
import { Fan } from 'lucide-react';

type FallingFan = {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  spin: number;
  drift: number;
};

function makeFans(count: number): FallingFan[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    duration: 2.4 + Math.random() * 1.8,
    delay: Math.random() * 0.45,
    size: 18 + Math.round(Math.random() * 22),
    spin: 360 + Math.round(Math.random() * 540),
    drift: -40 + Math.random() * 80,
  }));
}

export default function FanRain() {
  const [fans, setFans] = useState<FallingFan[]>([]);
  const [status, setStatus] = useState('');
  const statusId = useId();

  useEffect(() => {
    if (fans.length === 0) return;
    const longest = Math.max(...fans.map((fan) => (fan.duration + fan.delay) * 1000));
    const timer = window.setTimeout(() => {
      setFans([]);
      setStatus('');
    }, longest + 200);
    return () => window.clearTimeout(timer);
  }, [fans]);

  const dropFans = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setStatus('Only fans. No tracking. No OnlyFans.');
      window.setTimeout(() => setStatus(''), 2400);
      return;
    }
    setStatus('Only fans.');
    setFans(makeFans(28));
  };

  return (
    <>
      <button
        type="button"
        onClick={dropFans}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        title="Only fans"
        aria-describedby={statusId}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
          <path d="M24 4.003h-4.015c-3.45 0-5.3.197-6.748 1.957a7.996 7.996 0 1 0 2.103 9.211c3.182-.231 5.39-2.134 6.085-5.173 0 0-2.399.585-4.43 0 4.018-.777 6.333-3.037 7.005-5.995zM5.61 11.999A2.391 2.391 0 0 1 9.28 9.97a2.966 2.966 0 0 1 2.998-2.528h.008c-.92 1.778-1.407 3.352-1.998 5.263A2.392 2.392 0 0 1 5.61 12Zm2.386-7.996a7.996 7.996 0 1 0 7.996 7.996 7.996 7.996 0 0 0-7.996-7.996Zm0 10.394A2.399 2.399 0 1 1 10.395 12a2.396 2.396 0 0 1-2.399 2.398Z" />
        </svg>
        <span className="sr-only">Only fans joke</span>
      </button>

      <span id={statusId} className="sr-only" aria-live="polite">
        {status}
      </span>

      {fans.length > 0 ? (
        <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden="true">
          {fans.map((fan) => (
            <span
              key={fan.id}
              className="fan-fall absolute top-[-8vh] text-slate-300"
              style={{
                left: `${fan.left}vw`,
                animationDuration: `${fan.duration}s`,
                animationDelay: `${fan.delay}s`,
                ['--fan-spin' as string]: `${fan.spin}deg`,
                ['--fan-drift' as string]: `${fan.drift}px`,
              }}
            >
              <Fan size={fan.size} strokeWidth={1.75} />
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}
