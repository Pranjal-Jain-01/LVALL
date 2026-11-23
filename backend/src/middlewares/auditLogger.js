/**
 * auditLogger.js — HTTP-level audit logging middleware
 *
 * Logs every mutating request (POST/PUT/PATCH/DELETE) to the
 * application audit trail. Sensitive PII fields are redacted.
 */
'use strict';

const winston = require('winston');

const REDACTED = '[REDACTED]';
const SENSITIVE_FIELDS = new Set([
  'password', 'mfa_secret', 'pan_number', 'aadhaar_last4',
  'donor_email', 'donor_phone', 'national_id',
]);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    // TODO: add file / external SIEM transport for production
  ],
});

/**
 * Recursively redacts sensitive keys from an object clone.
 */
function redact(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redact);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      SENSITIVE_FIELDS.has(k.toLowerCase()) ? REDACTED : redact(v),
    ]),
  );
}

/**
 * auditLog middleware — logs mutating HTTP requests.
 */
function auditLog(req, res, next) {
  const MUTATING = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!process.env.AUDIT_LOG_ENABLED || !MUTATING.includes(req.method)) {
    return next();
  }

  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      type: 'http_audit',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      orgId: req.orgId ?? null,
      userId: req.user?.sub ?? null,
      userRole: req.user?.role ?? null,
      body: redact(req.body),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  });

  next();
}

module.exports = { auditLog, logger, redact };
