/**
 * rbac.js — Role-Based Access Control middleware
 *
 * Roles (from low → high privilege):
 *   field_worker < supervisor < finance_officer < org_admin
 *   verifier (independent, cross-org read)
 *   super_admin (platform level)
 *   public (unauthenticated)
 */
'use strict';

const ROLE_HIERARCHY = {
  field_worker: 1,
  supervisor: 2,
  finance_officer: 3,
  org_admin: 4,
  verifier: 2.5,  // Cross-org read access, sits between supervisor & finance_officer
  super_admin: 99,
};

/**
 * requireRole(...roles) — middleware factory.
 * Accepts if req.user.role matches ANY of the specified roles.
 *
 * @param {...string} roles
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role) && req.user.role !== 'super_admin') {
      return res.status(403).json({
        error: 'Insufficient permissions.',
        required: roles,
        actual: req.user.role,
      });
    }
    next();
  };
}

/**
 * requireMinRole(minRole) — middleware factory.
 * Accepts if req.user.role is at or above minRole in the hierarchy.
 *
 * @param {string} minRole
 */
function requireMinRole(minRole) {
  const minLevel = ROLE_HIERARCHY[minRole] ?? 0;
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    const userLevel = ROLE_HIERARCHY[req.user.role] ?? 0;
    if (userLevel < minLevel && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Insufficient role level.' });
    }
    next();
  };
}

module.exports = { requireRole, requireMinRole, ROLE_HIERARCHY };
