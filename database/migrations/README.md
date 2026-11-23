# Database Migrations

Migrations are numbered sequentially and must be applied in order.

| File | Description | Status |
|------|-------------|--------|
| `001_initial_schema.sql` | Full 26-table schema with enums, constraints, triggers (ER-01→ER-10), RLS policies, and indexes | 🔲 Pending |

## Naming Convention

```
{NNN}_{snake_case_description}.sql
```

## Applying Migrations

```bash
# Using psql directly
psql $DATABASE_URL -f migrations/001_initial_schema.sql

# Or with the helper script (once implemented)
npm run db:migrate
```

## Migration Checklist (001_initial_schema.sql)

The initial schema must implement all 26 tables across 8 domains:

### Domain 1 — Auth & Org (`auth_org` schema)
- [ ] `organisations` — multi-tenant root; `plan_tier`, `kyc_status` enums
- [ ] `users` — `user_role` enum, `mfa_secret` (KMS-encrypted reference), soft-delete
- [ ] `organisation_memberships` — composite PK `(org_id, user_id)`, role-per-org
- [ ] `organisation_registrations` — legal docs, jurisdiction, charity number

### Domain 2 — Contributions (`contributions` schema)
- [ ] `programmes` — fund programmes with `programme_type` enum
- [ ] `fund_pools` — allocatable buckets per programme
- [ ] `contributions` — donor contributions, `contribution_status` enum, PII fields
- [ ] `contribution_allocations` — M:M contributions ↔ fund_pools
- [ ] `tax_treatment_assessments` — Gift Aid / 80G / 501c3 eligibility records

### Domain 3 — Accounting (`accounting` schema)
- [ ] `chart_of_accounts` — hierarchical CoA per org
- [ ] `journal_entries` — double-entry header, `entry_status` enum
- [ ] `journal_lines` — debit/credit lines; balance check trigger (ER-01)

### Domain 4 — Compliance (`compliance` schema)
- [ ] `funding_agreements` — funder contracts with FCRA/CSR flags
- [ ] `disbursements` — payment records, `disbursement_status` enum
- [ ] `compliance_rules` — configurable rule definitions per org
- [ ] `compliance_checks` — rule evaluation results per disbursement

### Domain 5 — Activities (`activities` schema)
- [ ] `activity_events` — field-reported beneficiary events
- [ ] `evidence_files` — S3-linked proof docs with content hash
- [ ] `attestations` — multi-role sign-off chain (ER-04)
- [ ] `activity_disputes` — dispute lifecycle, `dispute_status` enum

### Domain 6 — Ledger (`ledger` schema)
- [ ] `signing_keys` — RSA/Ed25519 key metadata (KMS references)
- [ ] `ledger_events` — append-only immutable event log (ER-06)
- [ ] `ledger_batches` — Merkle-root batches linking ledger events

### Domain 7 — Public Receipts (`receipts` schema)
- [ ] `public_receipt_tokens` — HMAC-SHA256 token-hashed allowlist for donor-facing endpoints

### Domain 8 — Privacy & Audit (`audit` schema)
- [ ] `data_subject_requests` — GDPR/DPDP erasure & portability requests
- [ ] `access_audit_log` — immutable row-level access log (ER-10)

## Trigger Inventory (ER-01 → ER-10)

| ID | Trigger | Table | Behaviour |
|----|---------|-------|-----------|
| ER-01 | `trg_journal_balance` | `journal_lines` | AFTER INSERT/UPDATE — reject if debits ≠ credits per `journal_entry_id` |
| ER-02 | `trg_contribution_immutable` | `contributions` | BEFORE UPDATE — block status regression beyond `confirmed` |
| ER-03 | `trg_disbursement_budget` | `disbursements` | BEFORE INSERT/UPDATE — reject if cumulative disbursed > fund_pool.allocated_amount |
| ER-04 | `trg_attestation_chain` | `attestations` | BEFORE INSERT — enforce ordered role sequence (field→supervisor→verifier) |
| ER-05 | `trg_evidence_hash_lock` | `evidence_files` | BEFORE UPDATE — block changes to `content_sha256` once set |
| ER-06 | `trg_ledger_immutable` | `ledger_events` | BEFORE UPDATE/DELETE — unconditionally raise exception |
| ER-07 | `trg_set_updated_at` | (all mutable tables) | BEFORE UPDATE — set `updated_at = NOW()` |
| ER-08 | `trg_org_quota` | `users` | BEFORE INSERT — reject if active user count ≥ plan quota |
| ER-09 | `trg_dispute_lock` | `activity_events` | BEFORE UPDATE — lock event editing while dispute is open |
| ER-10 | `trg_audit_log` | (sensitive tables) | AFTER INSERT/UPDATE/DELETE — append row snapshot to `access_audit_log` |
