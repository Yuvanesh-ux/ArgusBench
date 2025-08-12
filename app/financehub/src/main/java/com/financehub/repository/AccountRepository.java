package com.financehub.repository;

import com.financehub.entity.Account;
import com.financehub.entity.Account.Type;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {
  List<Account> findByTenantIdOrderByCreatedAtDesc(String tenantId);
  Optional<Account> findByTenantIdAndId(String tenantId, String id);
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  Optional<Account> findWithLockingByTenantIdAndId(String tenantId, String id);
  boolean existsByTenantIdAndName(String tenantId, String name);
  Page<Account> findByTenantIdAndNameContainingIgnoreCase(String tenantId, String name, Pageable pageable);
  Page<Account> findByTenantIdAndTypeAndNameContainingIgnoreCase(String tenantId, Type type, String name, Pageable pageable);
}


