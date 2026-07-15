import { Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { BrandMark } from '../../components/BrandMark';
import { ui } from '../../styles/adminUi';

export function AffiliatePanelLayout() {
  return (
    <div style={ui.page}>
      <header style={ui.header}>
        <BrandMark subtitle="Sua página" />
        <button onClick={() => signOut(auth)} style={ui.buttonSecondary}>
          Sair
        </button>
      </header>
      <Outlet />
    </div>
  );
}
