package com.financehub.repository;

import com.financehub.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, String> {
  Page<Report> findByTenantId(String tenantId, Pageable pageable);
  java.util.Optional<Report> findByTenantIdAndId(String tenantId, String id);
}


