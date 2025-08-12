package com.financehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionCreateRequest {
  private String reference;
  private String idempotencyKey;
  @NotNull
  private List<Entry> entries;

  @Getter
  @Setter
  public static class Entry {
    @NotBlank
    private String accountId;
    @NotNull
    private BigDecimal amount;
    @NotBlank
    private String direction; // DEBIT or CREDIT
  }
}


