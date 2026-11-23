/**
 * Verifier portal — Supervisor & Independent Verifier
 *
 * Routes:
 *   /verify                → Review queue
 *   /verify/attest/:id     → Attestation form
 *   /verify/disputes       → Dispute queue
 *   /verify/disputes/:id   → Dispute detail & resolution
 */

import { Routes, Route } from 'react-router-dom';

export default function VerifierPortal() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Review Queue</h1><p className="text-gray-500 mt-2">Implementation pending.</p></div>} />
      <Route path="/attest/:id" element={<div className="p-8"><h1 className="text-2xl font-bold">Attestation</h1></div>} />
      <Route path="/disputes" element={<div className="p-8"><h1 className="text-2xl font-bold">Disputes</h1></div>} />
      <Route path="/disputes/:id" element={<div className="p-8"><h1 className="text-2xl font-bold">Dispute Detail</h1></div>} />
    </Routes>
  );
}
