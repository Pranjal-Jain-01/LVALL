/**
 * server.js — Entry point
 *
 * Starts the HTTP server and wires up graceful shutdown
 * so in-flight requests finish before the DB pool closes.
 */
'use strict';

require('dotenv').config();

const app = require('./app');
const { closePool } = require('./config/db');

const PORT = parseInt(process.env.PORT ?? '3001', 10);

const server = app.listen(PORT, () => {
  console.log(`[server] LoveAll Transparency Ledger API listening on port ${PORT}`);
  console.log(`[server] ENV=${process.env.NODE_ENV} | API_VERSION=${process.env.API_VERSION ?? 'v1'}`);
});

const shutdown = async (signal) => {
  console.log(`[server] ${signal} received — shutting down gracefully...`);
  server.close(async () => {
    await closePool();
    console.log('[server] Shutdown complete.');
    process.exit(0);
  });

  // Force-kill after 15s if graceful shutdown stalls
  setTimeout(() => {
    console.error('[server] Forced shutdown after timeout.');
    process.exit(1);
  }, 15_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err);
  shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled rejection:', reason);
  shutdown('unhandledRejection');
});

module.exports = server; // exported for supertest
