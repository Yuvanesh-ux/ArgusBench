package com.financehub.tenancy;

import com.financehub.entity.BaseEntity;
import jakarta.persistence.PrePersist;

public class PersistTenantListener {

  @PrePersist
  public void applyTenant(BaseEntity entity) {
    if (entity.getTenantId() == null || entity.getTenantId().isBlank()) {
      String tenantId = TenantContext.getTenantId();
      if (tenantId != null && !tenantId.isBlank()) {
        entity.setTenantId(tenantId);
      }
    }
  }
}


