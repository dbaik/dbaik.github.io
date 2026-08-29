const STORAGE_KEY = 'color-scheme';

export type PinnedColorScheme = 'light' | 'dark';

function metaEl(): HTMLMetaElement | null {
  return document.querySelector('meta[name="color-scheme"]');
}

export function readPinnedColorScheme(): PinnedColorScheme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
}

export function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolvedColorScheme(pinned: PinnedColorScheme | null): PinnedColorScheme {
  if (pinned) return pinned;
  return systemPrefersDark() ? 'dark' : 'light';
}

export function isLightScheme(): boolean {
  return resolvedColorScheme(readPinnedColorScheme()) === 'light';
}

export function applyColorScheme(pinned: PinnedColorScheme | null): void {
  const html = document.documentElement;
  html.classList.remove('scheme-light', 'scheme-dark');

  const meta = metaEl();
  if (!pinned) {
    localStorage.removeItem(STORAGE_KEY);
    if (meta) meta.content = 'light dark';
    return;
  }

  localStorage.setItem(STORAGE_KEY, pinned);
  html.classList.add(`scheme-${pinned}`);
  if (meta) meta.content = pinned;
}

/** Two-state toggle: follow system, or pin the opposite of the current system setting. */
export function toggleColorScheme(): PinnedColorScheme | null {
  const pinned = readPinnedColorScheme();
  if (!pinned) {
    const next: PinnedColorScheme = systemPrefersDark() ? 'light' : 'dark';
    applyColorScheme(next);
    return next;
  }

  applyColorScheme(null);
  return null;
}
