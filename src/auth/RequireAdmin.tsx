import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { AuthGateLoading } from './AuthGateLoading';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) return <AuthGateLoading />;
  if (!user || role !== 'admin') return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
