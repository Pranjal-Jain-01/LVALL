/**
 * public-receipts/router.js
 * Handles: public_receipt_tokens — token-hashed donor-facing endpoints
 */
'use strict';

const { Router } = require('express');
const { optionalAuth } = require('../../middlewares/auth');

const router = Router();

// --- Public Receipt Verification (no auth required) ---
// GET    /api/v1/receipts/:token            (verify receipt by HMAC token)
// GET    /api/v1/receipts/:token/pdf        (download PDF receipt)
// GET    /api/v1/receipts/:token/ledger     (view associated ledger event)

// --- Token Management (authenticated) ---
// POST   /api/v1/receipts/generate          (generate token for a contribution)
// DELETE /api/v1/receipts/:token            (revoke token)

router.get('/health', optionalAuth, (_req, res) => res.json({ module: 'public-receipts', status: 'ok' }));

module.exports = router;
