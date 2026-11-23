/**
 * ER-08: Organisation Quota Trigger
 * Verifies that trg_org_quota blocks user creation beyond plan quota.
 */
'use strict';

describe('ER-08 — Organisation User Quota', () => {
  test.todo('User invite within quota should succeed');
  test.todo('User invite that exceeds plan quota should return 422');
  test.todo('Soft-deleted users do not count toward quota');
  test.todo('Upgrading plan tier increases quota allowance');
});
