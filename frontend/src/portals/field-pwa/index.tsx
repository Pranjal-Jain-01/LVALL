/**
 * Field PWA portal — Mobile-first for Field Workers
 *
 * Routes:
 *   /field             → Today's activity list
 *   /field/report      → Report a new activity event
 *   /field/report/:id  → Edit / add evidence to an event
 *   /field/scan        → QR scanner for beneficiary ID
 *   /field/upload      → Evidence file upload
 */

import { Routes, Route } from 'react-router-dom';

export default function FieldPwaPortal() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-4"><h1 className="text-xl font-bold">My Activities</h1><p className="text-gray-500 mt-2">Implementation pending.</p></div>} />
      <Route path="/report" element={<div className="p-4"><h1 className="text-xl font-bold">Report Activity</h1></div>} />
      <Route path="/report/:id" element={<div className="p-4"><h1 className="text-xl font-bold">Edit Activity</h1></div>} />
      <Route path="/scan" element={<div className="p-4"><h1 className="text-xl font-bold">QR Scanner</h1></div>} />
      <Route path="/upload" element={<div className="p-4"><h1 className="text-xl font-bold">Upload Evidence</h1></div>} />
    </Routes>
  );
}
