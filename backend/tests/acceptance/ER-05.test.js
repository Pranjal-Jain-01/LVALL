/**
 * ER-05: Evidence Hash Lock Trigger
 * Verifies that trg_evidence_hash_lock prevents mutation of content_sha256.
 */
'use strict';

describe('ER-05 — Evidence Hash Immutability', () => {
  test.todo('content_sha256 can be set on first upload');
  test.todo('Attempt to change content_sha256 after set should return 422');
  test.todo('Other metadata fields (name, description) can still be updated');
});
