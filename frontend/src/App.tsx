/**
 * App.tsx — Portal-based routing
 *
 * Routes are grouped by portal. The active portal is determined by
 * VITE_PORTAL_MODE env var (useful for multi-domain deployments)
 * or by URL prefix in single-domain mode.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Portal index pages (lazy-loaded)
import AdminPortal from './portals/admin/index';
import FieldPwaPortal from './portals/field-pwa/index';
import VerifierPortal from './portals/verifier/index';
import PublicPortal from './portals/public/index';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

const PORTAL_MODE = import.meta.env.VITE_PORTAL_MODE ?? 'admin';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Admin & Finance Officer portal */}
          <Route path="/admin/*" element={<AdminPortal />} />

          {/* Field Worker mobile PWA */}
          <Route path="/field/*" element={<FieldPwaPortal />} />

          {/* Supervisor & Independent Verifier */}
          <Route path="/verify/*" element={<VerifierPortal />} />

          {/* Public donor dashboard & receipt verifier */}
          <Route path="/public/*" element={<PublicPortal />} />
          <Route path="/r/:token" element={<PublicPortal />} />

          {/* Root redirect based on portal mode */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  PORTAL_MODE === 'admin' ? '/admin'
                  : PORTAL_MODE === 'field-pwa' ? '/field'
                  : PORTAL_MODE === 'verifier' ? '/verify'
                  : '/public'
                }
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
