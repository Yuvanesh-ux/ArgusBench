package com.financehub.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LedgerEntryResponse {
  private Long id;
  private String transactionId;
  private String accountId;
  private BigDecimal amount;
  private String direction;
  private Instant createdAt;
}


