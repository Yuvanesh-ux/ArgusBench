package com.financehub.transactions;

import static org.assertj.core.api.Assertions.assertThat;

import com.financehub.dto.request.TransactionCreateRequest;
import com.financehub.entity.Account;
import com.financehub.entity.Transaction;
import com.financehub.entity.Transaction.Status;
import com.financehub.repository.AccountRepository;
import com.financehub.repository.TenantRepository;
import com.financehub.repository.TransactionRepository;
import com.financehub.service.TransactionService;
import com.financehub.tenancy.TenantContext;
import com.financehub.test.IntegrationTestBase;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class TransactionIntegrationTest extends IntegrationTestBase {

  @Autowired private TenantRepository tenantRepository;
  @Autowired private AccountRepository accountRepository;
  @Autowired private TransactionRepository transactionRepository;
  @Autowired private TransactionService transactionService;

  private String tenantId = "test-tenant";
  private String cashId;
  private String clearingId;

  @BeforeEach
  void setup() {
    TenantContext.setTenantId(tenantId);
    // Ensure tenant exists
    var t = new com.financehub.entity.Tenant();
    t.setId(tenantId);
    t.setSlug("test");
    t.setName("Test Tenant");
    t.setActive(true);
    if (!tenantRepository.existsById(tenantId)) {
      tenantRepository.save(t);
    }
    // Ensure accounts exist with zero balances
    cashId = ensureAccount("Cash");
    clearingId = ensureAccount("Clearing");
  }

  private String ensureAccount(String name) {
    return accountRepository.findByTenantIdAndNameContainingIgnoreCase(tenantId, name, org.springframework.data.domain.PageRequest.of(0, 1))
        .stream().findFirst().map(a -> a.getId())
        .orElseGet(() -> {
          Account a = new Account();
          a.setId(UUID.randomUUID().toString());
          a.setTenantId(tenantId);
          a.setName(name);
          a.setType(Account.Type.ASSET);
          a.setCurrency("USD");
          a.setBalance(BigDecimal.ZERO);
          a.setVersion(0L);
          return accountRepository.save(a).getId();
        });
  }

  @Test
  void idempotency_sameKeyReturnsSameTransaction() {
    TransactionCreateRequest req = new TransactionCreateRequest();
    req.setReference("idem");
    req.setIdempotencyKey("k1");
    var e1 = new TransactionCreateRequest.Entry();
    e1.setAccountId(cashId);
    e1.setAmount(BigDecimal.valueOf(100));
    e1.setDirection("DEBIT");
    var e2 = new TransactionCreateRequest.Entry();
    e2.setAccountId(clearingId);
    e2.setAmount(BigDecimal.valueOf(100));
    e2.setDirection("CREDIT");
    req.setEntries(List.of(e1, e2));

    String id1 = transactionService.create(req);
    String id2 = transactionService.create(req);
    assertThat(id1).isEqualTo(id2);
    long count = transactionRepository.findByTenantId(tenantId, org.springframework.data.domain.PageRequest.of(0, 10)).getTotalElements();
    assertThat(count).isEqualTo(1);
  }

  @Test
  void reversal_restoresBalances() {
    var startCash = accountRepository.findByTenantIdAndId(tenantId, cashId).orElseThrow().getBalance();
    var startClearing = accountRepository.findByTenantIdAndId(tenantId, clearingId).orElseThrow().getBalance();

    TransactionCreateRequest req = new TransactionCreateRequest();
    req.setReference("rev");
    req.setIdempotencyKey("rev-key");
    var d = new TransactionCreateRequest.Entry();
    d.setAccountId(cashId);
    d.setAmount(BigDecimal.valueOf(50));
    d.setDirection("DEBIT");
    var c = new TransactionCreateRequest.Entry();
    c.setAccountId(clearingId);
    c.setAmount(BigDecimal.valueOf(50));
    c.setDirection("CREDIT");
    req.setEntries(List.of(d, c));

    String tid = transactionService.create(req);
    var cashAfterPost = accountRepository.findByTenantIdAndId(tenantId, cashId).orElseThrow().getBalance();
    var clearingAfterPost = accountRepository.findByTenantIdAndId(tenantId, clearingId).orElseThrow().getBalance();
    assertThat(cashAfterPost).isEqualByComparingTo(startCash.add(BigDecimal.valueOf(50)));
    assertThat(clearingAfterPost).isEqualByComparingTo(startClearing.subtract(BigDecimal.valueOf(50)));

    String rid = transactionService.reverse(tid);
    var cashAfterReverse = accountRepository.findByTenantIdAndId(tenantId, cashId).orElseThrow().getBalance();
    var clearingAfterReverse = accountRepository.findByTenantIdAndId(tenantId, clearingId).orElseThrow().getBalance();
    assertThat(cashAfterReverse).isEqualByComparingTo(startCash);
    assertThat(clearingAfterReverse).isEqualByComparingTo(startClearing);

    Transaction original = transactionRepository.findByTenantIdAndId(tenantId, tid).orElseThrow();
    Transaction reversal = transactionRepository.findByTenantIdAndId(tenantId, rid).orElseThrow();
    assertThat(original.getStatus()).isEqualTo(Status.REVERSED);
    assertThat(reversal.getStatus()).isEqualTo(Status.POSTED);
  }

  @Test
  void concurrency_twoWritersSerialize() throws InterruptedException {
    var exec = Executors.newFixedThreadPool(2);
    CountDownLatch latch = new CountDownLatch(1);

    Runnable task = () -> {
      try {
        latch.await();
        TransactionCreateRequest req = new TransactionCreateRequest();
        req.setReference("concurrent");
        req.setIdempotencyKey(UUID.randomUUID().toString());
        var d = new TransactionCreateRequest.Entry();
        d.setAccountId(cashId);
        d.setAmount(BigDecimal.valueOf(100));
        d.setDirection("DEBIT");
        var c = new TransactionCreateRequest.Entry();
        c.setAccountId(clearingId);
        c.setAmount(BigDecimal.valueOf(100));
        c.setDirection("CREDIT");
        req.setEntries(List.of(d, c));
        transactionService.create(req);
      } catch (InterruptedException ignored) {}
    };
    exec.submit(task);
    exec.submit(task);
    latch.countDown();
    exec.shutdown();
    exec.awaitTermination(10, TimeUnit.SECONDS);

    var cash = accountRepository.findByTenantIdAndId(tenantId, cashId).orElseThrow().getBalance();
    var clearing = accountRepository.findByTenantIdAndId(tenantId, clearingId).orElseThrow().getBalance();
    assertThat(cash).isGreaterThanOrEqualTo(BigDecimal.valueOf(200));
    assertThat(clearing).isLessThanOrEqualTo(BigDecimal.valueOf(-200));
  }
}


