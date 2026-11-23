/**
 * Admin portal — Org Admin & Finance Officer
 *
 * Routes:
 *   /admin               → Dashboard
 *   /admin/contributions → Contribution list & Gift Aid management
 *   /admin/accounting    → Journal entries & trial balance
 *   /admin/compliance    → Disbursements & compliance checks
 *   /admin/ledger        → Ledger event log & batch sealing
 *   /admin/privacy       → DSR queue & audit log
 *   /admin/settings      → Org settings, users, plan
 */

import { Routes, Route } from 'react-router-dom';

export default function AdminPortal() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-gray-500 mt-2">Implementation pending.</p></div>} />
      <Route path="/contributions/*" element={<div className="p-8"><h1 className="text-2xl font-bold">Contributions</h1></div>} />
      <Route path="/accounting/*" element={<div className="p-8"><h1 className="text-2xl font-bold">Accounting</h1></div>} />
      <Route path="/compliance/*" element={<div className="p-8"><h1 className="text-2xl font-bold">Compliance</h1></div>} />
      <Route path="/ledger/*" element={<div className="p-8"><h1 className="text-2xl font-bold">Ledger</h1></div>} />
      <Route path="/privacy/*" element={<div className="p-8"><h1 className="text-2xl font-bold">Privacy & Audit</h1></div>} />
      <Route path="/settings/*" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
    </Routes>
  );
}
