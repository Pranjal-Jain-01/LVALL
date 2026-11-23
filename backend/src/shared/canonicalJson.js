/**
 * canonicalJson.js — Deterministic JSON serialisation
 *
 * Produces a canonical (key-sorted, normalised) JSON string suitable
 * for cryptographic signing of ledger events and receipts.
 */
'use strict';

/**
 * Recursively sorts object keys and normalises values for
 * deterministic serialisation.
 *
 * @param {any} value
 * @returns {any}
 */
function normalise(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(normalise);
  return Object.keys(value)
    .sort()
    .reduce((acc, k) => { acc[k] = normalise(value[k]); return acc; }, {});
}

/**
 * Serialises value to canonical JSON.
 *
 * @param {any} value
 * @returns {string}
 */
function toCanonicalJson(value) {
  return JSON.stringify(normalise(value));
}

/**
 * Parses a canonical JSON string back to a value.
 * (Alias for JSON.parse — included for symmetry.)
 *
 * @param {string} text
 * @returns {any}
 */
function fromCanonicalJson(text) {
  return JSON.parse(text);
}

module.exports = { toCanonicalJson, fromCanonicalJson, normalise };
