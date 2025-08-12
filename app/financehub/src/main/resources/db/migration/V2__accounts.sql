-- V2a: accounts table

CREATE TYPE account_type AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE');

CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  name VARCHAR(128) NOT NULL,
  type account_type NOT NULL,
  currency VARCHAR(3) NOT NULL,
  balance NUMERIC(18,2) NOT NULL DEFAULT 0,
  version BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_accounts_tenant_name UNIQUE (tenant_id, name),
  CONSTRAINT chk_currency_len CHECK (char_length(currency) = 3)
);

CREATE INDEX IF NOT EXISTS idx_accounts_tenant_created ON accounts(tenant_id, created_at DESC);


