package com.financehub.repository;

import com.financehub.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
  Page<AuditLog> findByTenantId(String tenantId, Pageable pageable);
}


