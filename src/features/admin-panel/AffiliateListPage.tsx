import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import type { LandingPageRecord } from '../../types/landingPage';

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
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, color: '#5D1E69', margin: 0 }}>Afiliadas</h1>
        <Link
          to="/admin/afiliadas/nova"
          style={{ background: '#5D1E69', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}
        >
          + Nova afiliada
        </Link>
      </div>

      {!affiliates && <p>Carregando...</p>}
      {affiliates && affiliates.length === 0 && <p>Nenhuma afiliada cadastrada ainda.</p>}

      {affiliates && affiliates.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: 8 }}>Slug</th>
              <th style={{ padding: 8 }}>Nome</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((a) => (
              <tr key={a.slug} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 8 }}>{a.slug}</td>
                <td style={{ padding: 8 }}>{a.affiliateName}</td>
                <td style={{ padding: 8 }}>{a.status === 'active' ? 'Ativa' : 'Inativa'}</td>
                <td style={{ padding: 8 }}>
                  <Link to={`/admin/afiliadas/${a.slug}`} style={{ color: '#5D1E69' }}>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
