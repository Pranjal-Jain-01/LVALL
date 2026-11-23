/**
 * contributions/router.js
 * Handles: programmes, fund_pools, contributions, allocations, tax assessments
 */
'use strict';

const { Router } = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole, requireMinRole } = require('../../middlewares/rbac');
const { attachTenantClient } = require('../../middlewares/tenantScope');

const router = Router();

// --- Programmes ---
// GET    /api/v1/contributions/programmes
// POST   /api/v1/contributions/programmes
// GET    /api/v1/contributions/programmes/:id
// PATCH  /api/v1/contributions/programmes/:id

// --- Fund Pools ---
// GET    /api/v1/contributions/fund-pools
// POST   /api/v1/contributions/fund-pools
// GET    /api/v1/contributions/fund-pools/:id

// --- Contributions ---
// GET    /api/v1/contributions
// POST   /api/v1/contributions
// GET    /api/v1/contributions/:id
// POST   /api/v1/contributions/:id/confirm
// POST   /api/v1/contributions/:id/allocate

// --- Tax Treatment Assessments ---
// POST   /api/v1/contributions/:id/tax-assessment
// GET    /api/v1/contributions/:id/tax-assessment

router.get('/health', (_req, res) => res.json({ module: 'contributions', status: 'ok' }));

module.exports = router;
