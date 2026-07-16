import { useEffect, useRef } from 'react';

function ensureFbqScriptLoaded() {
  if (window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  } as FbqFunction;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';

  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

const initializedPixelIds = new Set<string>();

export function useMetaPixel(pixelId: string | null | undefined) {
  // Keyed by pixelId (not a single boolean) so that a client-side route change
  // to a different affiliate's page — same component instance, new pixelId —
  // still fires its own PageView instead of being skipped as already-fired.
  const firedPageViewFor = useRef(new Set<string>());

  useEffect(() => {
    if (!pixelId) return;

    ensureFbqScriptLoaded();

    if (!initializedPixelIds.has(pixelId)) {
      initializedPixelIds.add(pixelId);
      window.fbq?.('init', pixelId);
    }

    if (!firedPageViewFor.current.has(pixelId)) {
      firedPageViewFor.current.add(pixelId);
      window.fbq?.('track', 'PageView');
    }
  }, [pixelId]);
}
