import { LoginForm } from '../../auth/LoginForm';

export function AffiliateLoginPage() {
  return (
    <LoginForm
      title="Painel da afiliada"
      subtitle="Entre para editar sua foto, texto, link e cores da sua página."
      redirectTo="/painel"
      expectedRole="affiliate"
    />
  );
}
