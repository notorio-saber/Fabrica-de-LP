import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { LandingPageRecord } from '../types/landingPage';

export type LandingPageDocState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: LandingPageRecord };

interface Options {
  /** When true, a doc whose status isn't 'active' is treated as not-found (public view). */
  requireActive?: boolean;
}

const MAX_RETRIES = 3;

export function useLandingPageDoc(slug: string | null, options: Options = {}): LandingPageDocState {
  const { requireActive = false } = options;
  const [state, setState] = useState<LandingPageDocState>({ status: 'loading' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!slug) {
      setState({ status: 'not-found' });
      return;
    }

    setState({ status: 'loading' });

    const unsubscribe = onSnapshot(
      doc(db, 'landingPages', slug),
      (snapshot) => {
        if (!snapshot.exists()) {
          setState({ status: 'not-found' });
          return;
        }
        const data = snapshot.data() as Omit<LandingPageRecord, 'slug'>;
        if (requireActive && data.status !== 'active') {
          setState({ status: 'not-found' });
          return;
        }
        setState({ status: 'ready', data: { ...data, slug: snapshot.id } });
      },
      (error) => {
        // A listener that starts right after a Firestore write can see a
        // stale permission evaluation once and error out permanently — retry
        // a few times before surfacing it as a real error.
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => setRetryCount((c) => c + 1), 1000);
        } else {
          setState({ status: 'error', message: error.message });
        }
      }
    );

    return unsubscribe;
  }, [slug, requireActive, retryCount]);

  return state;
}
