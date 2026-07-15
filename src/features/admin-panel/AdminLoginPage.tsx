import { LoginForm } from '../../auth/LoginForm';

export function AdminLoginPage() {
  return <LoginForm title="Painel administrativo" redirectTo="/admin" />;
}
