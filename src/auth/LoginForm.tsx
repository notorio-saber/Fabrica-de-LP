import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { BrandMark } from '../components/BrandMark';
import { brand, ui } from '../styles/adminUi';
import { useAuth } from './useAuth';

interface LoginFormProps {
  title: string;
  subtitle: string;
  redirectTo: string;
  footer?: ReactNode;
}

export function LoginForm({ title, subtitle, redirectTo, footer }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [stuck, setStuck] = useState(false);
  const { user, loading } = useAuth();

  // Sign-in kicks off Firebase's auth state change, but AuthProvider only
  // finishes resolving the role a moment later (it needs a Firestore read).
  // A plain client-side navigate() right after signIn's promise resolves
  // races ahead of that and RequireAdmin/RequireAffiliate see a stale,
  // signed-out state and bounce straight back here. A full page navigation
  // fired only once useAuth() itself has actually settled sidesteps the
  // whole class of SPA-state timing bugs — the destination route boots
  // fresh with a session that's already persisted.
  useEffect(() => {
    if (!loading && user) {
      window.location.assign(redirectTo);
    }
  }, [user, loading, redirectTo]);

  // If sign-in succeeds but the role lookup never comes back (a browser
  // extension or security software blocking requests to
  // firestore.googleapis.com is the usual cause), the effect above never
  // fires and the button would otherwise spin forever with no explanation
  // or way out.
  useEffect(() => {
    if (!submitting) return;
    setStuck(false);
    const timeout = setTimeout(() => setStuck(true), 8000);
    return () => clearTimeout(timeout);
  }, [submitting]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setResetMessage(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('E-mail ou senha inválidos.');
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setResetMessage(null);
    if (!email) {
      setError('Digite seu e-mail acima antes de pedir a redefinição de senha.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Enviamos um e-mail com o link pra redefinir sua senha.');
    } catch {
      setError('Não foi possível enviar o e-mail de redefinição.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: 24 }}>
        <BrandMark />
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
        <input
          style={ui.input}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          style={ui.input}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p style={ui.error}>{error}</p>}
        {resetMessage && <p style={ui.success}>{resetMessage}</p>}
        {stuck && (
          <div style={{ ...ui.card, padding: 12, background: '#FDF3EC' }}>
            <p style={{ ...ui.error, marginBottom: 8 }}>
              Isso está demorando demais. Pode ser uma extensão do navegador ou um antivírus bloqueando a conexão.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ ...ui.buttonSecondary, width: '100%' }}
            >
              Recarregar página
            </button>
          </div>
        )}
        <button style={ui.buttonPrimary} type="submit" disabled={submitting}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
        <button type="button" onClick={handleForgotPassword} style={{ ...ui.linkButton, alignSelf: 'center' }}>
          Esqueci minha senha
        </button>
      </form>
      {footer}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: brand.bodyFont,
    background: `linear-gradient(180deg, ${brand.canvas} 0%, #F3E7EE 100%)`,
    padding: '32px 16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    width: '100%',
    maxWidth: 360,
    background: brand.surface,
    padding: '32px 28px',
    borderRadius: 20,
    boxShadow: '0 12px 32px rgba(93, 30, 105, 0.12)',
    border: `1px solid ${brand.border}`,
  },
  title: {
    margin: 0,
    fontFamily: brand.headingFont,
    fontSize: 21,
    fontWeight: 600,
    color: brand.primary,
  },
  subtitle: {
    margin: '4px 0 4px',
    fontSize: 13,
    color: brand.mutedText,
    lineHeight: 1.4,
  },
};
