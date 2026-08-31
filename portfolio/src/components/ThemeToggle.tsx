import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  readPinnedColorScheme,
  resolvedColorScheme,
  toggleColorScheme,
  type PinnedColorScheme,
} from '../utils/colorScheme';

export default function ThemeToggle() {
  const [resolved, setResolved] = useState<PinnedColorScheme>(() =>
    typeof window === 'undefined' ? 'dark' : resolvedColorScheme(readPinnedColorScheme()),
  );

  useEffect(() => {
    const sync = () => {
      setResolved(resolvedColorScheme(readPinnedColorScheme()));
    };

    sync();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', sync);
    window.addEventListener('storage', sync);
    return () => {
      media.removeEventListener('change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleClick = () => {
    toggleColorScheme();
    setResolved(resolvedColorScheme(readPinnedColorScheme()));
  };

  const pinnedOppositeOfSystem = readPinnedColorScheme() !== null;
  const label =
    resolved === 'dark'
      ? pinnedOppositeOfSystem
        ? 'Use system color scheme'
        : 'Use light color scheme'
      : pinnedOppositeOfSystem
        ? 'Use system color scheme'
        : 'Use dark color scheme';

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-white/25 focus-visible:outline-none"
      aria-label={label}
      title={label}
    >
      {resolved === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
