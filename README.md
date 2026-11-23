# LoveAll Transparency Ledger

> **Multi-tenant NGO financial transparency, compliance, and impact-verification platform**

A monorepo containing a PostgreSQL 16+ database layer, Node.js/Express backend API, and a React + Vite + TypeScript frontend with four role-based portals.

---

## Repository Structure

```text
loveall-transparency-ledger/
├── database/
│   ├── migrations/     # SQL migration files (001_initial_schema.sql pending)
│   ├── seeds/          # 90-day prototype seed data
│   └── tests/          # SQL trigger tests (ER-01 → ER-10)
├── backend/            # Node.js + Express + pg
│   ├── src/
│   │   ├── config/     # DB pool, Object Storage, KMS stubs
│   │   ├── middlewares/ # Auth, RBAC, tenant scope, audit logging
│   │   ├── modules/    # 8 domain modules (auth-org, contributions, ...)
│   │   └── shared/     # Canonical JSON, ledger transaction, pagination
│   └── tests/acceptance/ # ER-01 → ER-10 acceptance test stubs
└── frontend/           # React + Vite + TypeScript + Tailwind CSS
    └── src/
        ├── portals/    # admin, field-pwa, verifier, public
        ├── types/      # 26-table TypeScript interfaces
        └── services/   # Typed Axios API client
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 16
- (Optional) Docker for local Postgres

### 1. Clone & install

```bash
git clone <repo-url>
cd loveall-transparency-ledger

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your local settings
```

### 3. Set up the database

```bash
# Create database
createdb lvall_dev

# Run migrations (once 001_initial_schema.sql is authored)
cd backend && npm run db:migrate

# Seed with prototype data
npm run db:seed
```

### 4. Run the backend

```bash
cd backend
npm run dev
# API available at http://localhost:3001/api/v1
# Health check: http://localhost:3001/health
```

### 5. Run the frontend

```bash
cd frontend
npm run dev
# UI available at http://localhost:5173
```

---

## Domain Model — 26 Tables across 8 Domains

| # | Domain | Tables |
|---|--------|---------|
| 1 | **Auth & Org** | `organisations`, `users`, `organisation_memberships`, `organisation_registrations` |
| 2 | **Contributions** | `programmes`, `fund_pools`, `contributions`, `contribution_allocations`, `tax_treatment_assessments` |
| 3 | **Accounting** | `chart_of_accounts`, `journal_entries`, `journal_lines` |
| 4 | **Compliance** | `funding_agreements`, `disbursements`, `compliance_rules`, `compliance_checks` |
| 5 | **Activities** | `activity_events`, `evidence_files`, `attestations`, `activity_disputes` |
| 6 | **Ledger** | `signing_keys`, `ledger_events`, `ledger_batches` |
| 7 | **Public Receipts** | `public_receipt_tokens` |
| 8 | **Privacy & Audit** | `data_subject_requests`, `access_audit_log` |

---

## Business Rule Triggers (ER-01 → ER-10)

| ID | Trigger | Enforces |
|----|---------|----------|
| ER-01 | `trg_journal_balance` | Debits must equal credits per journal entry |
| ER-02 | `trg_contribution_immutable` | No status regression past `confirmed` |
| ER-03 | `trg_disbursement_budget` | Cannot disburse more than fund pool balance |
| ER-04 | `trg_attestation_chain` | field_worker → supervisor → verifier ordering |
| ER-05 | `trg_evidence_hash_lock` | `content_sha256` is write-once |
| ER-06 | `trg_ledger_immutable` | Ledger events cannot be updated or deleted |
| ER-07 | `trg_set_updated_at` | `updated_at` auto-stamps on every mutation |
| ER-08 | `trg_org_quota` | Active users cannot exceed plan quota |
| ER-09 | `trg_dispute_lock` | Activity events locked while dispute is open |
| ER-10 | `trg_audit_log` | Every DML on sensitive tables logged to `access_audit_log` |

---

## User Roles

| Role | Scope | Capabilities |
|------|-------|--------------|
| `field_worker` | Org | Report activity events, upload evidence, first attestation |
| `supervisor` | Org | Review & second-attest events, raise/resolve disputes |
| `finance_officer` | Org | Manage contributions, disbursements, journal entries |
| `org_admin` | Org | Full org management, user invites, settings, DSR processing |
| `verifier` | Cross-org | Read-only review + third-party attestation |
| `super_admin` | Platform | All orgs, key rotation, platform settings |

---

## Frontend Portals

| Portal | URL prefix | Audience |
|--------|------------|----------|
| **Admin** | `/admin` | Org Admin, Finance Officer |
| **Field PWA** | `/field` | Field Workers (mobile-optimised) |
| **Verifier** | `/verify` | Supervisors, Independent Verifiers |
| **Public** | `/public`, `/r/:token` | Donors, general public |

---

## Compliance & Privacy

- **GDPR / DPDP** — Data Subject Request (DSR) workflow for erasure and portability
- **Gift Aid / 80G / 501(c)(3)** — Tax treatment assessments per contribution
- **FCRA / CSR** — Flags on funding agreements for India-specific compliance
- **Row-Level Security** — PostgreSQL RLS with `app.current_org_id` session variable
- **Immutable Audit Log** — `access_audit_log` written by DB trigger (ER-10)
- **Cryptographic Ledger** — RSA/Ed25519 signed events, Merkle-batched for tamper evidence

---

## Development Conventions

- **API versioning**: `/api/v1/...`
- **Money**: All amounts stored as `NUMERIC(18,4)`, serialised as strings to avoid float precision loss
- **Timestamps**: All in UTC; PostgreSQL `TIMESTAMPTZ`; TypeScript `ISODateString`
- **UUIDs**: `gen_random_uuid()` for all primary keys
- **Pagination**: Cursor-based preferred; offset available for exports
- **Error format**: `{ error: string, detail?: string, pgCode?: string }`

---

## Roadmap

- [ ] `001_initial_schema.sql` — Full 26-table schema with RLS & triggers
- [ ] 90-day seed data scripts
- [ ] ER-01 → ER-10 SQL trigger tests
- [ ] Auth module — JWT login, refresh, MFA
- [ ] Contributions CRUD + Gift Aid calculator
- [ ] Double-entry accounting engine
- [ ] Evidence upload pipeline (S3 + hash verification)
- [ ] Attestation chain (ER-04)
- [ ] Cryptographic ledger (signing + Merkle batch)
- [ ] Public donor receipt portal
- [ ] GDPR DSR processing workflow
- [ ] Admin portal UI
- [ ] Field PWA (offline-capable)
- [ ] Verifier review queue
- [ ] Public transparency dashboard
