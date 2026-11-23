/**
 * db.js — PostgreSQL connection pool
 *
 * Uses the `pg` library's Pool for multi-tenant workloads.
 * Row-Level Security (RLS) is enforced at the DB layer;
 * every request must call setTenantContext() before querying.
 */
'use strict';

const { Pool } = require('pg');

let pool;

/**
 * Returns the singleton Pool instance, creating it on first call.
 * @returns {import('pg').Pool}
 */
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      min: parseInt(process.env.DB_POOL_MIN ?? '2', 10),
      max: parseInt(process.env.DB_POOL_MAX ?? '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS ?? '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS ?? '5000', 10),
      // Parse all numeric types as JS numbers instead of strings
      types: {
        // Override pg's default BigInt → string behaviour
        getTypeParser: (oid, format) => {
          const defaultParser = require('pg').types.getTypeParser(oid, format);
          return defaultParser;
        },
      },
    });

    pool.on('connect', (client) => {
      // Enforce UTC for all sessions
      client.query("SET TIME ZONE 'UTC'");
    });

    pool.on('error', (err) => {
      console.error('[DB] Unexpected pool error:', err.message);
    });
  }
  return pool;
}

/**
 * Sets the PostgreSQL session variable `app.current_org_id` for RLS.
 * Must be called at the start of every authenticated request.
 *
 * @param {import('pg').PoolClient} client
 * @param {string} orgId  — UUID of the current tenant organisation
 */
async function setTenantContext(client, orgId) {
  await client.query('SELECT set_config($1, $2, true)', ['app.current_org_id', orgId]);
}

/**
 * Convenience wrapper: acquires a client, runs fn(client), then releases.
 * Rolls back automatically on error.
 *
 * @param {function(import('pg').PoolClient): Promise<any>} fn
 */
async function withTransaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Gracefully shuts down the pool. Called on SIGTERM/SIGINT.
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[DB] Pool closed.');
  }
}

module.exports = { getPool, setTenantContext, withTransaction, closePool };
