-- V2b: transactions and ledger entries

CREATE TYPE txn_status AS ENUM ('PENDING', 'POSTED', 'REVERSED');
CREATE TYPE entry_direction AS ENUM ('DEBIT', 'CREDIT');

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  reference VARCHAR(64),
  posted_at TIMESTAMPTZ,
  status txn_status NOT NULL DEFAULT 'PENDING',
  created_by VARCHAR(36),
  idempotency_key VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_txn_tenant_idem UNIQUE (tenant_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id BIGSERIAL PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  transaction_id VARCHAR(36) NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  account_id VARCHAR(36) NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0),
  direction entry_direction NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ledger_txn ON ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_account ON ledger_entries(account_id);


