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
  const hasFiredPageView = useRef(false);

  useEffect(() => {
    if (!pixelId) return;

    ensureFbqScriptLoaded();

    if (!initializedPixelIds.has(pixelId)) {
      initializedPixelIds.add(pixelId);
      window.fbq?.('init', pixelId);
    }

    if (!hasFiredPageView.current) {
      hasFiredPageView.current = true;
      window.fbq?.('track', 'PageView');
    }
  }, [pixelId]);
}
