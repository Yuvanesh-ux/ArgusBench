package com.financehub.repository;

import com.financehub.entity.Tenant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, String> {
  Optional<Tenant> findBySlugAndActiveTrue(String slug);
}


