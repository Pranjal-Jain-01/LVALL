/**
 * privacy-audit/router.js
 * Handles: data_subject_requests, access_audit_log
 */
'use strict';

const { Router } = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { attachTenantClient } = require('../../middlewares/tenantScope');

const router = Router();

// --- Data Subject Requests (GDPR / DPDP) ---
// POST   /api/v1/privacy/dsr              (submit erasure or portability request)
// GET    /api/v1/privacy/dsr              (org_admin: list all DSRs)
// GET    /api/v1/privacy/dsr/:id          (status of a specific DSR)
// PATCH  /api/v1/privacy/dsr/:id/process  (org_admin: process DSR)

// --- Access Audit Log (ER-10) ---
// GET    /api/v1/privacy/audit-log        (org_admin / super_admin: paginated audit log)
// GET    /api/v1/privacy/audit-log/:table (filter by table name)

router.get('/health', (_req, res) => res.json({ module: 'privacy-audit', status: 'ok' }));

module.exports = router;
