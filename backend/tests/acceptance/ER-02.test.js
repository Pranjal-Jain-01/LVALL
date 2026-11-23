/**
 * ER-02: Contribution Immutability Trigger
 * Verifies that trg_contribution_immutable blocks illegal status regressions.
 */
'use strict';

describe('ER-02 — Contribution Immutability', () => {
  test.todo('Contribution status can advance: pending → confirmed');
  test.todo('Contribution status cannot regress: confirmed → pending should return 422');
  test.todo('Confirmed contribution amount cannot be changed');
});
