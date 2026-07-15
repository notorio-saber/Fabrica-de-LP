import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLandingPage } from '../features/public-landing/PublicLandingPage';
import { AdminLoginPage } from '../features/admin-panel/AdminLoginPage';
import { AdminLayout } from '../features/admin-panel/AdminLayout';
import { AffiliateListPage } from '../features/admin-panel/AffiliateListPage';
import { AffiliateFormPage } from '../features/admin-panel/AffiliateFormPage';
import { AffiliateLoginPage } from '../features/affiliate-panel/AffiliateLoginPage';
import { AffiliatePanelLayout } from '../features/affiliate-panel/AffiliatePanelLayout';
import { AffiliateEditPage } from '../features/affiliate-panel/AffiliateEditPage';
import { RequireAdmin } from '../auth/RequireAdmin';
import { RequireAffiliate } from '../auth/RequireAffiliate';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLandingPage />} />
        <Route path="/p/:slug" element={<PublicLandingPage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AffiliateListPage />} />
          <Route path="afiliadas/nova" element={<AffiliateFormPage />} />
          <Route path="afiliadas/:slug" element={<AffiliateFormPage />} />
        </Route>

        <Route path="/painel/login" element={<AffiliateLoginPage />} />
        <Route
          path="/painel"
          element={
            <RequireAffiliate>
              <AffiliatePanelLayout />
            </RequireAffiliate>
          }
        >
          <Route index element={<AffiliateEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
