import { useState, type FormEvent } from 'react';
import { LoginForm } from '../../auth/LoginForm';
import { bootstrapAdmin } from './services/bootstrapAdmin';
import { brand, ui } from '../../styles/adminUi';

export function AdminLoginPage() {
  const [showBootstrap, setShowBootstrap] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleBootstrap = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await bootstrapAdmin(email, password);
      // LoginForm's own effect redirects once useAuth() resolves the new
      // admin's role — no manual navigate here, see LoginForm.tsx.
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível criar o administrador (talvez já exista um). Peça pra ele te cadastrar.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <div style={{ textAlign: 'center', marginTop: 20, width: '100%', maxWidth: 360 }}>
      <button type="button" onClick={() => setShowBootstrap((v) => !v)} style={ui.linkButton}>
        Ainda não existe administrador? Criar o primeiro acesso
      </button>

      {showBootstrap && (
        <form
          onSubmit={handleBootstrap}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: '100%',
            margin: '16px auto 0',
            textAlign: 'left',
            background: brand.surface,
            padding: 24,
            borderRadius: 16,
            border: `1px solid ${brand.border}`,
            boxShadow: '0 6px 20px rgba(93, 30, 105, 0.08)',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: brand.mutedText, lineHeight: 1.5 }}>
            Isso cria a conta do primeiro administrador da fábrica. Só funciona uma vez — depois disso, novos
            acessos são criados por aqui mesmo, dentro do painel.
          </p>
          <input
            type="email"
            placeholder="E-mail do administrador"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={ui.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            style={ui.input}
          />
          {error && <p style={ui.error}>{error}</p>}
          <button type="submit" disabled={submitting} style={ui.buttonPrimary}>
            {submitting ? 'Criando...' : 'Criar administrador'}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <LoginForm
      title="Painel administrativo"
      subtitle="Gerencie as afiliadas e as páginas geradas pela fábrica."
      redirectTo="/admin"
      footer={footer}
    />
  );
}
