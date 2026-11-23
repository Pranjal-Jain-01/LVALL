/**
 * auth.js — JWT authentication middleware
 *
 * Verifies Bearer tokens, attaches decoded payload to req.user,
 * and sets req.orgId for downstream tenant scoping.
 */
'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * requireAuth middleware — rejects unauthenticated requests.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;          // { sub, email, role, orgId, ... }
    req.orgId = payload.orgId;   // Current tenant org
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

/**
 * optionalAuth — sets req.user if token present, else continues.
 * Used for public receipt endpoints that accept optional auth.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.slice(7), JWT_SECRET);
      req.orgId = req.user.orgId;
    } catch {
      // Invalid token — treat as unauthenticated
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
