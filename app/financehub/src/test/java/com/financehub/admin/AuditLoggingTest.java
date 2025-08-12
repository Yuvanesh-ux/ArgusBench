package com.financehub.admin;

import static org.assertj.core.api.Assertions.assertThat;

import com.financehub.dto.request.AccountCreateRequest;
import com.financehub.repository.AuditLogRepository;
import com.financehub.service.AccountService;
import com.financehub.tenancy.TenantContext;
import com.financehub.test.IntegrationTestBase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

class AuditLoggingTest extends IntegrationTestBase {

  @Autowired private AccountService accountService;
  @Autowired private AuditLogRepository auditLogRepository;

  @BeforeEach
  void setup() {
    TenantContext.setTenantId("test-tenant");
  }

  @Test
  @Transactional
  void createAccount_triggersAuditLog() {
    long before = auditLogRepository.findByTenantId("test-tenant", org.springframework.data.domain.PageRequest.of(0, 10)).getTotalElements();

    AccountCreateRequest req = new AccountCreateRequest();
    req.setName("Audited");
    req.setType("ASSET");
    req.setCurrency("USD");
    accountService.create(req);

    long after = auditLogRepository.findByTenantId("test-tenant", org.springframework.data.domain.PageRequest.of(0, 10)).getTotalElements();
    assertThat(after).isGreaterThan(before);
  }
}


