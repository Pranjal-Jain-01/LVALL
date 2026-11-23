/**
 * storage.js — Object Storage abstraction stub
 *
 * Supports three providers: local filesystem, AWS S3, and GCS.
 * Actual SDK integrations are stubbed; swap in real SDKs for production.
 */
'use strict';

const path = require('path');
const fs = require('fs/promises');
const { createHash } = require('crypto');

const PROVIDER = process.env.STORAGE_PROVIDER ?? 'local';
const BUCKET = process.env.STORAGE_BUCKET ?? 'lvall-evidence';
const LOCAL_PATH = process.env.STORAGE_LOCAL_PATH ?? './uploads';

/**
 * Uploads a file buffer to the configured object storage.
 *
 * @param {Object} params
 * @param {Buffer} params.buffer    — File contents
 * @param {string} params.key       — Storage key / object path
 * @param {string} params.mimeType  — MIME type
 * @param {Object} [params.metadata] — Additional metadata tags
 * @returns {Promise<{ key: string, sha256: string, sizeBytes: number, url: string }>}
 */
async function upload({ buffer, key, mimeType, metadata = {} }) {
  const sha256 = createHash('sha256').update(buffer).digest('hex');

  if (PROVIDER === 'local') {
    const dest = path.join(LOCAL_PATH, key);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buffer);
    return { key, sha256, sizeBytes: buffer.length, url: `/uploads/${key}` };
  }

  if (PROVIDER === 's3') {
    // TODO: import @aws-sdk/client-s3 and implement PutObjectCommand
    throw new Error('[storage] S3 provider not yet implemented. Set STORAGE_PROVIDER=local for development.');
  }

  if (PROVIDER === 'gcs') {
    // TODO: import @google-cloud/storage and implement upload
    throw new Error('[storage] GCS provider not yet implemented.');
  }

  throw new Error(`[storage] Unknown STORAGE_PROVIDER: ${PROVIDER}`);
}

/**
 * Generates a time-limited pre-signed URL (or local redirect URL).
 *
 * @param {string} key        — Storage object key
 * @param {number} [expiresIn=3600]  — TTL in seconds
 * @returns {Promise<string>}  Presigned URL
 */
async function getPresignedUrl(key, expiresIn = 3600) {
  if (PROVIDER === 'local') {
    // For local dev, return a simple URL — no signing needed
    return `/uploads/${key}`;
  }
  if (PROVIDER === 's3') {
    // TODO: implement GetObjectCommand presigned URL via @aws-sdk/s3-request-presigner
    throw new Error('[storage] S3 presigned URLs not yet implemented.');
  }
  throw new Error(`[storage] getPresignedUrl not implemented for provider: ${PROVIDER}`);
}

/**
 * Deletes an object from storage. Used during GDPR erasure workflows.
 *
 * @param {string} key
 * @returns {Promise<void>}
 */
async function remove(key) {
  if (PROVIDER === 'local') {
    const dest = path.join(LOCAL_PATH, key);
    await fs.rm(dest, { force: true });
    return;
  }
  throw new Error(`[storage] remove not implemented for provider: ${PROVIDER}`);
}

module.exports = { upload, getPresignedUrl, remove, PROVIDER, BUCKET };
