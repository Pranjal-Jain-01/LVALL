# Database Trigger & Constraint Tests

SQL-level acceptance tests verifying every business rule trigger (ER-01 through ER-10).

## Test Files

| File | Trigger | What it tests |
|------|---------|---------------|
| `ER-01_journal_balance.sql` | `trg_journal_balance` | Rejects unbalanced journal entries; accepts balanced ones |
| `ER-02_contribution_immutable.sql` | `trg_contribution_immutable` | Blocks illegal status regressions on contributions |
| `ER-03_disbursement_budget.sql` | `trg_disbursement_budget` | Rejects over-budget disbursements |
| `ER-04_attestation_chain.sql` | `trg_attestation_chain` | Enforces field→supervisor→verifier ordering |
| `ER-05_evidence_hash_lock.sql` | `trg_evidence_hash_lock` | Prevents mutation of `content_sha256` |
| `ER-06_ledger_immutable.sql` | `trg_ledger_immutable` | Any UPDATE/DELETE on ledger_events raises exception |
| `ER-07_updated_at.sql` | `trg_set_updated_at` | Confirms `updated_at` advances on row mutation |
| `ER-08_org_quota.sql` | `trg_org_quota` | Blocks user creation beyond plan quota |
| `ER-09_dispute_lock.sql` | `trg_dispute_lock` | Locks activity_event editing while dispute is open |
| `ER-10_audit_log.sql` | `trg_audit_log` | Confirms audit rows are written for DML on sensitive tables |

## Test Convention

Each file uses PostgreSQL's `DO $$` block pattern:

```sql
-- ER-XX: <test name>
BEGIN;

-- Setup: insert prerequisite rows
-- ...

-- Positive case (must succeed)
-- ...

-- Negative case (must raise)
DO $$
BEGIN
  BEGIN
    -- statement that should fail
    RAISE EXCEPTION 'FAIL: expected exception was not raised';
  EXCEPTION WHEN others THEN
    -- expected; test passes
    RAISE NOTICE 'PASS: %', SQLERRM;
  END;
END $$;

ROLLBACK; -- keep DB clean
```

## Running Tests

```bash
# Run all trigger tests
for f in tests/ER-*.sql; do psql $DATABASE_URL -f "$f"; done

# Or with npm helper
npm run db:test
```
