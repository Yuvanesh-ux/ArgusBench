package com.financehub.repository;

import com.financehub.entity.LedgerEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, Long> {

  @Query("select le from LedgerEntry le where le.tenantId = :tenantId and le.account.id = :accountId")
  Page<LedgerEntry> findByTenantIdAndAccountId(
      @Param("tenantId") String tenantId,
      @Param("accountId") String accountId,
      Pageable pageable);
}


