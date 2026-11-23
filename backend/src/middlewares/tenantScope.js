/**
 * tenantScope.js — Multi-tenant PostgreSQL RLS context setter
 *
 * Sets the `app.current_org_id` session variable so that all
 * RLS policies on tenant-scoped tables are enforced automatically.
 */
'use strict';

const { getPool, setTenantContext } = require('../config/db');

/**
 * attachTenantClient middleware.
 *
 * Acquires a pg client from the pool, sets the RLS context variable,
 * and attaches it to `req.dbClient`. Releases on response close.
 *
 * MUST be used AFTER requireAuth (needs req.orgId).
 */
async function attachTenantClient(req, res, next) {
  if (!req.orgId) {
    return res.status(400).json({ error: 'Tenant org ID not resolved.' });
  }

  const pool = getPool();
  let client;
  try {
    client = await pool.connect();
    await setTenantContext(client, req.orgId);
    req.dbClient = client;
  } catch (err) {
    if (client) client.release();
    return next(err);
  }

  // Release the client once the response is fully sent
  res.on('finish', () => client.release());
  res.on('close', () => client.release());

  next();
}

module.exports = { attachTenantClient };
