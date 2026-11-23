/**
 * compliance/router.js
 * Handles: funding_agreements, disbursements, compliance_rules, compliance_checks
 */
'use strict';

const { Router } = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { attachTenantClient } = require('../../middlewares/tenantScope');

const router = Router();

// --- Funding Agreements ---
// GET    /api/v1/compliance/agreements
// POST   /api/v1/compliance/agreements
// GET    /api/v1/compliance/agreements/:id
// PATCH  /api/v1/compliance/agreements/:id

// --- Disbursements ---
// GET    /api/v1/compliance/disbursements
// POST   /api/v1/compliance/disbursements    (ER-03 budget check enforced)
// GET    /api/v1/compliance/disbursements/:id
// PATCH  /api/v1/compliance/disbursements/:id/status

// --- Compliance Rules ---
// GET    /api/v1/compliance/rules
// POST   /api/v1/compliance/rules
// DELETE /api/v1/compliance/rules/:id

// --- Compliance Checks ---
// GET    /api/v1/compliance/checks
// POST   /api/v1/compliance/checks/run      (run all rules against a disbursement)

router.get('/health', (_req, res) => res.json({ module: 'compliance', status: 'ok' }));

module.exports = router;
