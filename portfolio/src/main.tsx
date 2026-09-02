import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function loadJakarta() {
  // After first paint: a static import would put Jakarta on the critical path.
  void Promise.all([
    import('@fontsource/plus-jakarta-sans/latin-400.css'),
    import('@fontsource/plus-jakarta-sans/latin-700.css'),
  ]);
}

function afterFirstPaint(callback: () => void) {
  const idleWindow = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };

  const run = () => {
    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleWindow.requestIdleCallback(callback, { timeout: 1800 });
      return;
    }
    window.setTimeout(callback, 200);
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(run);
  });
}

afterFirstPaint(loadJakarta);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
