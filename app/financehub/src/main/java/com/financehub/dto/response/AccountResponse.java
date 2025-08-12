package com.financehub.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AccountResponse {
  private String id;
  private String name;
  private String type;
  private String currency;
  private BigDecimal balance;
  private Instant createdAt;
}


