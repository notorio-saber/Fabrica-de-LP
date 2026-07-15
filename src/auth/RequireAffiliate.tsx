import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function RequireAffiliate({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user || role !== 'affiliate') return <Navigate to="/painel/login" replace />;

  return <>{children}</>;
}
