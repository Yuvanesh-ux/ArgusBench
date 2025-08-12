package com.financehub.accounts;

import static org.assertj.core.api.Assertions.assertThat;

import com.financehub.dto.request.AccountCreateRequest;
import com.financehub.dto.response.AccountResponse;
import com.financehub.service.AccountService;
import com.financehub.tenancy.TenantContext;
import com.financehub.test.IntegrationTestBase;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

class AccountIntegrationTest extends IntegrationTestBase {

  @Autowired private AccountService accountService;

  @BeforeEach
  void setTenant() {
    // For integration tests, set a fake tenant id; migrations ensure tenants table exists
    TenantContext.setTenantId("test-tenant");
  }

  @Test
  @Transactional
  void createAndListAccounts_scopedByTenant() {
    AccountCreateRequest req = new AccountCreateRequest();
    req.setName("Cash");
    req.setType("ASSET");
    req.setCurrency("USD");
    AccountResponse created = accountService.create(req);
    assertThat(created.getId()).isNotBlank();
    assertThat(created.getName()).isEqualTo("Cash");

    var page = accountService.list(null, null, 0, 10, null);
    assertThat(page.getTotalElements()).isGreaterThanOrEqualTo(1);
    assertThat(page.getContent().stream().map(AccountResponse::getName)).contains("Cash");
  }
}


