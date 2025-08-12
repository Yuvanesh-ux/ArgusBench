package com.financehub.repository;

import com.financehub.entity.FileResource;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileResourceRepository extends JpaRepository<FileResource, String> {
  Page<FileResource> findByTenantId(String tenantId, Pageable pageable);
  Optional<FileResource> findByTenantIdAndId(String tenantId, String id);
}


