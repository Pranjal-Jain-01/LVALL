/**
 * ledger/router.js
 * Handles: signing_keys, ledger_events, ledger_batches
 */
'use strict';

const { Router } = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { attachTenantClient } = require('../../middlewares/tenantScope');

const router = Router();

// --- Ledger Events (read-only; immutable via ER-06) ---
// GET    /api/v1/ledger/events
// GET    /api/v1/ledger/events/:id
// GET    /api/v1/ledger/events/:id/verify   (re-verify signature)

// --- Ledger Batches ---
// GET    /api/v1/ledger/batches
// POST   /api/v1/ledger/batches             (org_admin — seal pending events into Merkle batch)
// GET    /api/v1/ledger/batches/:id
// GET    /api/v1/ledger/batches/:id/proof   (Merkle inclusion proof for a given event)

// --- Signing Keys ---
// GET    /api/v1/ledger/keys                (super_admin only)
// POST   /api/v1/ledger/keys/rotate         (rotate active signing key)

router.get('/health', (_req, res) => res.json({ module: 'ledger', status: 'ok' }));

module.exports = router;
