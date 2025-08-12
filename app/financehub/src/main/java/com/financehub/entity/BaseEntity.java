package com.financehub.entity;

import com.financehub.tenancy.PersistTenantListener;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(PersistTenantListener.class)
public abstract class BaseEntity {
  @Column(name = "tenant_id", nullable = false, updatable = false)
  private String tenantId;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();
}


