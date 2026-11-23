/**
 * accounting/router.js
 * Handles: chart_of_accounts, journal_entries, journal_lines
 */
'use strict';

const { Router } = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { attachTenantClient } = require('../../middlewares/tenantScope');

const router = Router();

// --- Chart of Accounts ---
// GET    /api/v1/accounting/accounts
// POST   /api/v1/accounting/accounts
// GET    /api/v1/accounting/accounts/:id
// PATCH  /api/v1/accounting/accounts/:id

// --- Journal Entries ---
// GET    /api/v1/accounting/journals
// POST   /api/v1/accounting/journals       (creates entry + lines atomically; ER-01 enforced)
// GET    /api/v1/accounting/journals/:id
// POST   /api/v1/accounting/journals/:id/post
// POST   /api/v1/accounting/journals/:id/void

// --- Trial Balance (read-only report)
// GET    /api/v1/accounting/trial-balance

router.get('/health', (_req, res) => res.json({ module: 'accounting', status: 'ok' }));

module.exports = router;
