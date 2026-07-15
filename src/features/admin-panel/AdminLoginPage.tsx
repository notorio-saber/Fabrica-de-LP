import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../auth/LoginForm';
import { bootstrapAdmin } from './services/bootstrapAdmin';

export function AdminLoginPage() {
  const [showBootstrap, setShowBootstrap] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleBootstrap = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await bootstrapAdmin(email, password);
      navigate('/admin', { replace: true });
    } catch {
      setError('Não foi possível criar o administrador (talvez já exista um). Peça pra ele te cadastrar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <LoginForm title="Painel administrativo" redirectTo="/admin" />

      <div style={{ textAlign: 'center', marginTop: -8, marginBottom: 32, fontFamily: 'system-ui, sans-serif' }}>
        <button
          type="button"
          onClick={() => setShowBootstrap((v) => !v)}
          style={{ background: 'none', border: 'none', color: '#5D1E69', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Primeiro acesso? Criar administrador
        </button>

        {showBootstrap && (
          <form
            onSubmit={handleBootstrap}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340, margin: '16px auto 0', background: '#ffffff', padding: 24, borderRadius: 16, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
          >
            <input
              type="email"
              placeholder="E-mail do administrador"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
            />
            {error && <p style={{ color: '#c0392b', fontSize: 13, margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              style={{ marginTop: 8, padding: '12px 14px', borderRadius: 8, border: 'none', background: '#5D1E69', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >
              {submitting ? 'Criando...' : 'Criar administrador'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
