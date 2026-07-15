import { Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

export function AdminLayout() {
  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 32px',
          borderBottom: '1px solid #eee',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <strong style={{ color: '#5D1E69' }}>Fábrica de Landing Page — Admin</strong>
        <button
          onClick={() => signOut(auth)}
          style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}
        >
          Sair
        </button>
      </header>
      <Outlet />
    </div>
  );
}
