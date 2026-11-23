/**
 * errorHandler.js — Centralised Express error handler
 *
 * Normalises errors into a consistent JSON envelope.
 * Must be registered LAST in the Express middleware chain.
 */
'use strict';

const { logger } = require('./auditLogger');

/** Well-known error codes → HTTP status map */
const PG_ERROR_STATUS = {
  '23505': 409,  // unique_violation
  '23503': 409,  // foreign_key_violation
  '23514': 422,  // check_violation
  'P0001': 422,  // raise_exception (triggers)
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // PostgreSQL driver errors
  if (err.code && PG_ERROR_STATUS[err.code]) {
    return res.status(PG_ERROR_STATUS[err.code]).json({
      error: 'Database constraint violation.',
      detail: err.detail ?? err.message,
      pgCode: err.code,
    });
  }

  // Validation errors (Joi)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed.',
      details: err.details?.map((d) => d.message),
    });
  }

  // JWT errors (should be caught in auth.js, but just in case)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: err.message });
  }

  // Generic / unexpected
  const status = err.status ?? err.statusCode ?? 500;
  if (status >= 500) {
    logger.error({ type: 'unhandled_error', message: err.message, stack: err.stack });
  }

  return res.status(status).json({
    error: status >= 500 ? 'Internal server error.' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
