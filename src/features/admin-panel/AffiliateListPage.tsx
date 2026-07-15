import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import type { LandingPageRecord } from '../../types/landingPage';
import { brand, ui } from '../../styles/adminUi';

export function AffiliateListPage() {
  const [affiliates, setAffiliates] = useState<LandingPageRecord[] | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'landingPages'), (snapshot) => {
      setAffiliates(
        snapshot.docs.map((d) => ({ ...(d.data() as Omit<LandingPageRecord, 'slug'>), slug: d.id }))
      );
    });
  }, []);

  return (
    <div style={ui.content}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={ui.pageTitle}>Afiliadas</h1>
          <p style={ui.pageSubtitle}>Cada afiliada tem sua própria página pública, gerada a partir de um dos temas da fábrica.</p>
        </div>
        <Link to="/admin/afiliadas/nova" style={{ ...ui.buttonPrimary, textDecoration: 'none', display: 'inline-block' }}>
          + Nova afiliada
        </Link>
      </div>

      {!affiliates && <p style={{ color: brand.mutedText, fontSize: 14 }}>Carregando...</p>}

      {affiliates && affiliates.length === 0 && (
        <div style={{ ...ui.card, ...ui.emptyState }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: brand.text }}>Nenhuma afiliada cadastrada ainda</p>
          <p style={{ margin: 0 }}>
            Clique em <strong>+ Nova afiliada</strong> pra criar a primeira página — isso cria a conta de login dela e
            a página pública ao mesmo tempo.
          </p>
        </div>
      )}

      {affiliates && affiliates.length > 0 && (
        <div style={{ ...ui.card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', background: brand.canvas }}>
                <th style={{ padding: '12px 16px', color: brand.mutedText, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Slug</th>
                <th style={{ padding: '12px 16px', color: brand.mutedText, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Nome</th>
                <th style={{ padding: '12px 16px', color: brand.mutedText, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Status</th>
                <th style={{ padding: '12px 16px', color: brand.mutedText, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Link da página</th>
                <th style={{ padding: '12px 16px' }}></th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <tr key={a.slug} style={{ borderTop: `1px solid ${brand.border}` }}>
                  <td style={{ padding: '12px 16px', color: brand.text }}>{a.slug}</td>
                  <td style={{ padding: '12px 16px', color: brand.text }}>{a.affiliateName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: a.status === 'active' ? '#E6F4EA' : '#F3E7EE',
                        color: a.status === 'active' ? brand.success : brand.mutedText,
                      }}
                    >
                      {a.status === 'active' ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <a
                      href={`/p/${a.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ ...ui.linkButton, textDecoration: 'none' }}
                    >
                      /p/{a.slug}
                    </a>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Link to={`/admin/afiliadas/${a.slug}`} style={{ ...ui.linkButton, textDecoration: 'none' }}>
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
