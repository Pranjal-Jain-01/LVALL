/**
 * ER-09: Dispute Lock Trigger
 * Verifies that trg_dispute_lock prevents editing activity_events while a dispute is open.
 */
'use strict';

describe('ER-09 — Activity Event Dispute Lock', () => {
  test.todo('Activity event can be edited when no dispute is open');
  test.todo('Opening a dispute locks the activity event from further edits');
  test.todo('Resolving a dispute unlocks the activity event');
  test.todo('Verifier can still read (not edit) a locked event');
});
