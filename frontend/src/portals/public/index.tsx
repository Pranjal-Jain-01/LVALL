/**
 * Public portal — Donor dashboard & receipt verifier
 *
 * Routes:
 *   /public              → Donor-facing transparency dashboard
 *   /public/contribute   → Donor giving page
 *   /r/:token            → Token-based receipt verification
 */

import { Routes, Route } from 'react-router-dom';

export default function PublicPortal() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-white p-8">
            <h1 className="text-3xl font-bold text-blue-600">LoveAll Transparency</h1>
            <p className="text-gray-600 mt-2">View how your contribution makes an impact.</p>
            <p className="text-gray-400 mt-8 text-sm">Implementation pending.</p>
          </div>
        }
      />
      <Route path="/contribute" element={<div className="p-8"><h1 className="text-2xl font-bold">Give</h1></div>} />
      <Route path="/receipt/:token" element={<div className="p-8"><h1 className="text-2xl font-bold">Verify Receipt</h1></div>} />
    </Routes>
  );
}
