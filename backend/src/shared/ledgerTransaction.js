/**
 * ledgerTransaction.js — Atomic ledger event writer
 *
 * Wraps any database mutation in a PostgreSQL transaction that also
 * appends a signed, immutable ledger_event row. All business-critical
 * state changes (contributions, disbursements, attestations, etc.)
 * must go through this helper.
 */
'use strict';

const { withTransaction } = require('../config/db');
const { toCanonicalJson } = require('./canonicalJson');
const { sign } = require('../config/kms');
const { v4: uuidv4 } = require('uuid');

/**
 * Executes a business operation inside a DB transaction and
 * appends a signed ledger event.
 *
 * @param {Object} params
 * @param {string}   params.eventType     — Ledger event type (e.g. 'contribution.confirmed')
 * @param {string}   params.orgId         — Tenant org UUID
 * @param {string}   params.actorId       — User UUID performing the action
 * @param {Object}   params.payload       — Domain-specific event data (will be canonicalised)
 * @param {function(import('pg').PoolClient): Promise<any>} params.operation
 *   — The business DB writes to perform inside the same transaction
 * @returns {Promise<{ result: any, ledgerEventId: string }>}
 */
async function writeLedgerEvent({ eventType, orgId, actorId, payload, operation }) {
  return withTransaction(async (client) => {
    // 1. Execute the business operation
    const result = await operation(client);

    // 2. Canonicalise and sign the event payload
    const eventId = uuidv4();
    const occurredAt = new Date().toISOString();
    const canonicalPayload = toCanonicalJson({ eventType, orgId, actorId, payload, occurredAt });
    const { signature, keyId, algorithm } = await sign(canonicalPayload);

    // 3. Append immutable ledger event (trigger ER-06 blocks UPDATE/DELETE)
    await client.query(
      `INSERT INTO ledger.ledger_events
         (id, org_id, event_type, actor_id, payload, signature, key_id, algorithm, occurred_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)`,
      [eventId, orgId, eventType, actorId, canonicalPayload, signature, keyId, algorithm, occurredAt],
    );

    return { result, ledgerEventId: eventId };
  });
}

module.exports = { writeLedgerEvent };
