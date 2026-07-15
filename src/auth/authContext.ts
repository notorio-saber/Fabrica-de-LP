import { createContext } from 'react';
import type { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  role: 'admin' | 'affiliate' | null;
  slug: string | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  slug: null,
  loading: true,
});
