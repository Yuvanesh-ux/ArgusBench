package com.financehub.repository;

import com.financehub.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
  Optional<User> findByTenantIdAndEmail(String tenantId, String email);
  boolean existsByTenantIdAndEmail(String tenantId, String email);
  long countByTenantIdAndRole(String tenantId, String role);
}


