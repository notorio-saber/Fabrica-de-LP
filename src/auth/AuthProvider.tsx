import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { AuthContext, type AuthState } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, role: null, slug: null, loading: true });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, role: null, slug: null, loading: false });
        return;
      }

      // Reflect the signed-in user immediately and re-enter loading while the
      // role doc is fetched — otherwise a redirect right after sign-in races
      // ahead of this state update and RequireAdmin/RequireAffiliate see a
      // stale `user: null` and bounce back to the login screen.
      setState((prev) => ({ ...prev, user, loading: true }));

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.data() as { role?: 'admin' | 'affiliate'; slug?: string | null } | undefined;

      setState({
        user,
        role: data?.role ?? null,
        slug: data?.slug ?? null,
        loading: false,
      });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
