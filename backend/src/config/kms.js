/**
 * kms.js — Key Management Service abstraction stub
 *
 * Provides signing (Ed25519 / RSA-PSS) and encryption primitives
 * backed by either a local file-based key store (dev) or a cloud KMS.
 */
'use strict';

const { createSign, createVerify, createHmac, randomBytes } = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const PROVIDER = process.env.KMS_PROVIDER ?? 'local';
const LOCAL_KEY_PATH = process.env.SIGNING_KEY_LOCAL_PATH ?? './keys';

/**
 * Signs arbitrary data with the active signing key.
 *
 * @param {string | Buffer} data
 * @param {string} [algorithm='RSA-SHA256']
 * @returns {Promise<{ signature: string, keyId: string, algorithm: string }>}
 */
async function sign(data, algorithm = 'RSA-SHA256') {
  if (PROVIDER === 'local') {
    const keyPath = path.join(LOCAL_KEY_PATH, 'signing.key.pem');
    let privateKey;
    try {
      privateKey = await fs.readFile(keyPath, 'utf8');
    } catch {
      // Auto-generate a placeholder notice in dev
      return {
        signature: '__DEV_PLACEHOLDER_SIGNATURE__',
        keyId: 'local-dev-key',
        algorithm,
      };
    }
    const signer = createSign(algorithm);
    signer.update(data);
    signer.end();
    return {
      signature: signer.sign(privateKey, 'base64'),
      keyId: 'local-dev-key',
      algorithm,
    };
  }

  if (PROVIDER === 'aws-kms') {
    // TODO: implement via @aws-sdk/client-kms SignCommand
    throw new Error('[kms] AWS KMS signing not yet implemented.');
  }

  if (PROVIDER === 'gcp-kms') {
    // TODO: implement via @google-cloud/kms
    throw new Error('[kms] GCP KMS signing not yet implemented.');
  }

  throw new Error(`[kms] Unknown KMS_PROVIDER: ${PROVIDER}`);
}

/**
 * Verifies a signature against data and a known key ID.
 *
 * @param {string | Buffer} data
 * @param {string} signature  — base64-encoded
 * @param {string} keyId
 * @param {string} [algorithm='RSA-SHA256']
 * @returns {Promise<boolean>}
 */
async function verify(data, signature, keyId, algorithm = 'RSA-SHA256') {
  if (PROVIDER === 'local') {
    const keyPath = path.join(LOCAL_KEY_PATH, 'signing.pub.pem');
    try {
      const publicKey = await fs.readFile(keyPath, 'utf8');
      const verifier = createVerify(algorithm);
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch {
      return false;
    }
  }
  throw new Error(`[kms] verify not implemented for provider: ${PROVIDER}`);
}

/**
 * Generates an HMAC-SHA256 token (used for public receipt tokens).
 *
 * @param {string} payload
 * @returns {string}  hex digest
 */
function hmacToken(payload) {
  const secret = process.env.JWT_SECRET ?? 'dev-hmac-secret';
  return createHmac('sha256', secret).update(payload).digest('hex');
}

module.exports = { sign, verify, hmacToken };
