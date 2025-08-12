-- V3: reports, files, notifications

CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  type VARCHAR(64) NOT NULL,
  parameters JSONB,
  generated_by VARCHAR(36),
  file_path VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_tenant_created ON reports(tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS files (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  original_name VARCHAR(255) NOT NULL,
  path VARCHAR(512) NOT NULL,
  mime_type VARCHAR(128) NOT NULL,
  size BIGINT NOT NULL CHECK (size >= 0),
  uploaded_by VARCHAR(36),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_files_tenant_created ON files(tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  user_id VARCHAR(36),
  type VARCHAR(64) NOT NULL,
  payload JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_tenant_created ON notifications(tenant_id, created_at DESC);


