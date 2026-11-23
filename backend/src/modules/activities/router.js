/**
 * activities/router.js
 * Handles: activity_events, evidence_files, attestations, activity_disputes
 */
'use strict';

const { Router } = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { attachTenantClient } = require('../../middlewares/tenantScope');

const router = Router();

// --- Activity Events ---
// GET    /api/v1/activities
// POST   /api/v1/activities                (field_worker report)
// GET    /api/v1/activities/:id
// PATCH  /api/v1/activities/:id            (locked when dispute open — ER-09)

// --- Evidence Files ---
// POST   /api/v1/activities/:id/evidence   (multipart upload)
// GET    /api/v1/activities/:id/evidence
// GET    /api/v1/activities/:id/evidence/:fileId/url   (presigned URL)

// --- Attestations ---
// POST   /api/v1/activities/:id/attest     (ER-04 chain enforced)
// GET    /api/v1/activities/:id/attestations

// --- Disputes ---
// POST   /api/v1/activities/:id/dispute
// GET    /api/v1/activities/:id/dispute
// PATCH  /api/v1/activities/:id/dispute/resolve

router.get('/health', (_req, res) => res.json({ module: 'activities', status: 'ok' }));

module.exports = router;
