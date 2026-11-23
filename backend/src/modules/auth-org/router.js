/**
 * auth-org/router.js
 * Handles: organisations, users, memberships, registrations
 */
'use strict';

const { Router } = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const { attachTenantClient } = require('../../middlewares/tenantScope');

const router = Router();

// POST   /api/v1/auth/register          — Register a new organisation
// POST   /api/v1/auth/login             — Exchange credentials for JWT
// POST   /api/v1/auth/refresh           — Refresh access token
// POST   /api/v1/auth/logout            — Invalidate refresh token
// GET    /api/v1/auth/me                — Current user profile
// PATCH  /api/v1/auth/me                — Update profile
// GET    /api/v1/auth/users             — List org members (org_admin)
// POST   /api/v1/auth/users/invite      — Invite user to org
// PATCH  /api/v1/auth/users/:userId/role — Change member role
// DELETE /api/v1/auth/users/:userId     — Remove member

router.get('/health', (_req, res) => res.json({ module: 'auth-org', status: 'ok' }));

// TODO: implement handlers in ./controllers.js

module.exports = router;
