import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user || role !== 'admin') return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
