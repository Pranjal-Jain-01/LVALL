/**
 * pagination.js — Cursor-based & offset pagination helpers
 *
 * Provides consistent pagination for all list endpoints.
 * Prefer cursor-based for large/live datasets; offset for exports.
 */
'use strict';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parses pagination query params from an Express request.
 *
 * @param {Object} query  — req.query
 * @returns {{ limit: number, offset: number, cursor: string|null }}
 */
function parsePagination(query) {
  const limit = Math.min(parseInt(query.limit ?? DEFAULT_LIMIT, 10), MAX_LIMIT);
  const offset = parseInt(query.offset ?? '0', 10);
  const cursor = query.cursor ?? null;
  return { limit, offset: isNaN(offset) ? 0 : offset, cursor };
}

/**
 * Builds a pagination envelope for list responses.
 *
 * @param {Object} params
 * @param {any[]}   params.rows      — Result rows from DB
 * @param {number}  params.total     — Total matching count (for offset pagination)
 * @param {number}  params.limit
 * @param {number}  params.offset
 * @param {string}  [params.cursorField='id']  — Field to use as cursor
 * @returns {Object}
 */
function buildPage({ rows, total, limit, offset, cursorField = 'id' }) {
  const nextOffset = offset + rows.length;
  const nextCursor = rows.length === limit ? rows[rows.length - 1]?.[cursorField] : null;

  return {
    data: rows,
    pagination: {
      total,
      limit,
      offset,
      nextOffset: nextOffset < total ? nextOffset : null,
      nextCursor,
    },
  };
}

module.exports = { parsePagination, buildPage, DEFAULT_LIMIT, MAX_LIMIT };
