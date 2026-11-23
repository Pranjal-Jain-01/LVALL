# Database Seeds

This directory contains seed scripts for populating the LoveAll Transparency Ledger with realistic prototype data simulating **90 days of NGO operations**.

## Planned Seed Files

| File | Description | Records (approx.) |
|------|-------------|--------------------|
| `001_organisations.sql` | 3 tenant orgs (Charity-IN, Charity-UK, Charity-US) + admin users | 3 orgs, 15 users |
| `002_programmes_funds.sql` | 6 programmes, 12 fund pools | 18 records |
| `003_contributions.sql` | 90-day donor contribution stream with Gift Aid / 80G mix | ~500 contributions |
| `004_accounting.sql` | Chart of accounts + 90-day journal entries | ~1 200 journal lines |
| `005_activities.sql` | Field activity events, evidence files, attestation chains | ~300 events |
| `006_disbursements.sql` | Disbursement records with compliance check results | ~180 disbursements |
| `007_ledger.sql` | Ledger events and Merkle batch snapshots | ~600 ledger events |
| `008_public_tokens.sql` | Public receipt tokens for donor portal demo | ~100 tokens |

## Running Seeds

```bash
# Apply all seeds in order after migrations
for f in seeds/*.sql; do psql $DATABASE_URL -f "$f"; done

# Or with npm helper
npm run db:seed
```

> ⚠️ Seeds are for development/prototype use only. Never run against production.
