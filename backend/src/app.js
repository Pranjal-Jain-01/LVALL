/**
 * app.js — Express application factory
 *
 * Sets up all global middleware, mounts module routers,
 * and registers the error handler.
 */
'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { auditLog } = require('./middlewares/auditLogger');
const { errorHandler } = require('./middlewares/errorHandler');

// Module routers
const authOrgRouter = require('./modules/auth-org/router');
const contributionsRouter = require('./modules/contributions/router');
const accountingRouter = require('./modules/accounting/router');
const complianceRouter = require('./modules/compliance/router');
const activitiesRouter = require('./modules/activities/router');
const ledgerRouter = require('./modules/ledger/router');
const publicReceiptsRouter = require('./modules/public-receipts/router');
const privacyAuditRouter = require('./modules/privacy-audit/router');

const app = express();

// ── Security middlewares ──────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()),
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '200', 10),
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// ── Parsing & logging ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(auditLog);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── API routes ────────────────────────────────────────────────────────────────
const API = `/api/${process.env.API_VERSION ?? 'v1'}`;

app.use(`${API}/auth`, authOrgRouter);
app.use(`${API}/contributions`, contributionsRouter);
app.use(`${API}/accounting`, accountingRouter);
app.use(`${API}/compliance`, complianceRouter);
app.use(`${API}/activities`, activitiesRouter);
app.use(`${API}/ledger`, ledgerRouter);
app.use(`${API}/receipts`, publicReceiptsRouter);
app.use(`${API}/privacy`, privacyAuditRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

// ── Centralised error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
