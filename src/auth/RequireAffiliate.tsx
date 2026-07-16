import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { AuthGateLoading } from './AuthGateLoading';

export function RequireAffiliate({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) return <AuthGateLoading />;
  if (!user || role !== 'affiliate') return <Navigate to="/painel/login" replace />;

  return <>{children}</>;
}
