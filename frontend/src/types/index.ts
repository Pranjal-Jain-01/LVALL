/**
 * types/index.ts — TypeScript interfaces mirroring the 26 PostgreSQL tables & enums
 *
 * Keep in sync with the backend database schema.
 * All UUIDs are typed as `string`.
 * All timestamps are ISO 8601 strings.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared / Primitives
// ─────────────────────────────────────────────────────────────────────────────

export type UUID = string;
export type ISODateString = string;
export type MoneyAmount = string; // NUMERIC(18,4) stored as string to avoid float precision loss

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    nextOffset: number | null;
    nextCursor: string | null;
  };
}

export interface ApiError {
  error: string;
  detail?: string;
  details?: string[];
  pgCode?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain 1 — Auth & Org
// ─────────────────────────────────────────────────────────────────────────────

export type PlanTier = 'free' | 'starter' | 'growth' | 'enterprise';
export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type UserRole = 'field_worker' | 'supervisor' | 'finance_officer' | 'org_admin' | 'verifier' | 'super_admin';

export interface Organisation {
  id: UUID;
  name: string;
  slug: string;
  planTier: PlanTier;
  kycStatus: KycStatus;
  logoUrl: string | null;
  primaryCurrency: string;  // ISO 4217
  jurisdiction: string;     // ISO 3166-1 alpha-2
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface User {
  id: UUID;
  email: string;
  displayName: string;
  role: UserRole;
  orgId: UUID;
  mfaEnabled: boolean;
  deletedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface OrganisationMembership {
  orgId: UUID;
  userId: UUID;
  role: UserRole;
  joinedAt: ISODateString;
}

export interface OrganisationRegistration {
  id: UUID;
  orgId: UUID;
  charityNumber: string | null;
  jurisdiction: string;
  registrationDoc: string | null;  // Storage key
  fcraExempt: boolean;
  csrEligible: boolean;
  registeredAt: ISODateString;
  updatedAt: ISODateString;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain 2 — Contributions
// ─────────────────────────────────────────────────────────────────────────────

export type ProgrammeType = 'unrestricted' | 'restricted' | 'endowment' | 'csr';
export type ContributionStatus = 'pending' | 'confirmed' | 'allocated' | 'refunded' | 'failed';
export type TaxScheme = 'gift_aid' | '80g' | '501c3' | 'none';

export interface Programme {
  id: UUID;
  orgId: UUID;
  name: string;
  description: string | null;
  programmeType: ProgrammeType;
  startDate: ISODateString;
  endDate: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface FundPool {
  id: UUID;
  programmeId: UUID;
  orgId: UUID;
  name: string;
  currency: string;
  allocatedAmount: MoneyAmount;
  disbursedAmount: MoneyAmount;
  remainingAmount: MoneyAmount;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Contribution {
  id: UUID;
  orgId: UUID;
  donorName: string;             // May be anonymised
  donorEmail: string | null;     // PII — redacted in public views
  amount: MoneyAmount;
  currency: string;
  status: ContributionStatus;
  receivedAt: ISODateString;
  confirmedAt: ISODateString | null;
  taxScheme: TaxScheme;
  referenceCode: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ContributionAllocation {
  id: UUID;
  contributionId: UUID;
  fundPoolId: UUID;
  amount: MoneyAmount;
  allocatedAt: ISODateString;
}

export interface TaxTreatmentAssessment {
  id: UUID;
  contributionId: UUID;
  orgId: UUID;
  taxScheme: TaxScheme;
  eligibleAmount: MoneyAmount;
  reclaimableAmount: MoneyAmount;
  assessedAt: ISODateString;
  assessedBy: UUID;  // User ID
  notes: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain 3 — Accounting
// ─────────────────────────────────────────────────────────────────────────────

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type EntryStatus = 'draft' | 'posted' | 'voided';

export interface ChartOfAccount {
  id: UUID;
  orgId: UUID;
  code: string;
  name: string;
  accountType: AccountType;
  parentId: UUID | null;
  isActive: boolean;
  createdAt: ISODateString;
}

export interface JournalEntry {
  id: UUID;
  orgId: UUID;
  reference: string;
  description: string;
  entryStatus: EntryStatus;
  entryDate: ISODateString;
  createdBy: UUID;
  postedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lines?: JournalLine[];
}

export interface JournalLine {
  id: UUID;
  journalEntryId: UUID;
  accountId: UUID;
  debit: MoneyAmount;
  credit: MoneyAmount;
  description: string | null;
  currency: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain 4 — Compliance
// ─────────────────────────────────────────────────────────────────────────────

export type DisbursementStatus = 'draft' | 'approved' | 'paid' | 'cancelled';
export type CheckResult = 'pass' | 'fail' | 'warning' | 'skipped';

export interface FundingAgreement {
  id: UUID;
  orgId: UUID;
  funderName: string;
  agreementRef: string;
  totalAmount: MoneyAmount;
  currency: string;
  startDate: ISODateString;
  endDate: ISODateString;
  fcraRequired: boolean;
  csrCompliant: boolean;
  documentKey: string | null;  // Storage key
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Disbursement {
  id: UUID;
  orgId: UUID;
  fundPoolId: UUID;
  agreementId: UUID | null;
  amount: MoneyAmount;
  currency: string;
  status: DisbursementStatus;
  payeeName: string;
  paymentRef: string | null;
  paidAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ComplianceRule {
  id: UUID;
  orgId: UUID;
  name: string;
  description: string;
  ruleLogic: Record<string, unknown>;  // JSONB rule definition
  isActive: boolean;
  createdAt: ISODateString;
}

export interface ComplianceCheck {
  id: UUID;
  disbursementId: UUID;
  ruleId: UUID;
  result: CheckResult;
  detail: string | null;
  checkedAt: ISODateString;
  checkedBy: UUID | null;  // null = automated
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain 5 — Activities
// ─────────────────────────────────────────────────────────────────────────────

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'withdrawn';

export interface ActivityEvent {
  id: UUID;
  orgId: UUID;
  programmeId: UUID;
  reportedBy: UUID;    // field_worker user ID
  beneficiaryCount: number;
  location: string | null;
  description: string;
  eventDate: ISODateString;
  gpsLat: number | null;
  gpsLng: number | null;
  lockedByDispute: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface EvidenceFile {
  id: UUID;
  activityEventId: UUID;
  orgId: UUID;
  storageKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  contentSha256: string;  // Immutable after set (ER-05)
  uploadedBy: UUID;
  uploadedAt: ISODateString;
}

export interface Attestation {
  id: UUID;
  activityEventId: UUID;
  attestedBy: UUID;
  role: UserRole;
  attestedAt: ISODateString;
  notes: string | null;
}

export interface ActivityDispute {
  id: UUID;
  activityEventId: UUID;
  raisedBy: UUID;
  status: DisputeStatus;
  reason: string;
  resolution: string | null;
  raisedAt: ISODateString;
  resolvedAt: ISODateString | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain 6 — Ledger
// ─────────────────────────────────────────────────────────────────────────────

export type KeyAlgorithm = 'RSA-SHA256' | 'Ed25519';

export interface SigningKey {
  id: UUID;
  orgId: UUID;
  algorithm: KeyAlgorithm;
  publicKeyPem: string;
  isActive: boolean;
  rotatedAt: ISODateString | null;
  createdAt: ISODateString;
}

export interface LedgerEvent {
  id: UUID;
  orgId: UUID;
  eventType: string;
  actorId: UUID;
  payload: Record<string, unknown>;
  signature: string;
  keyId: UUID;
  algorithm: KeyAlgorithm;
  occurredAt: ISODateString;
  batchId: UUID | null;
}

export interface LedgerBatch {
  id: UUID;
  orgId: UUID;
  merkleRoot: string;
  eventCount: number;
  sealedAt: ISODateString;
  sealedBy: UUID;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain 7 — Public Receipts
// ─────────────────────────────────────────────────────────────────────────────

export interface PublicReceiptToken {
  id: UUID;
  contributionId: UUID;
  orgId: UUID;
  tokenHash: string;    // HMAC-SHA256, never expose raw token
  expiresAt: ISODateString | null;
  revokedAt: ISODateString | null;
  createdAt: ISODateString;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain 8 — Privacy & Audit
// ─────────────────────────────────────────────────────────────────────────────

export type DsrType = 'erasure' | 'portability' | 'rectification';
export type DsrStatus = 'submitted' | 'in_progress' | 'completed' | 'rejected';

export interface DataSubjectRequest {
  id: UUID;
  orgId: UUID;
  requestType: DsrType;
  status: DsrStatus;
  subjectEmail: string;
  submittedAt: ISODateString;
  processedAt: ISODateString | null;
  processedBy: UUID | null;
  notes: string | null;
}

export interface AccessAuditLog {
  id: UUID;
  orgId: UUID;
  tableName: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  rowId: UUID;
  actorId: UUID | null;
  beforeSnapshot: Record<string, unknown> | null;
  afterSnapshot: Record<string, unknown> | null;
  occurredAt: ISODateString;
}
