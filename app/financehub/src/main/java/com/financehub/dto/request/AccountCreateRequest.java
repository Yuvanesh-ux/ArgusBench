package com.financehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountCreateRequest {
  @NotBlank
  @Size(max = 128)
  private String name;

  @NotBlank
  @Pattern(regexp = "^(ASSET|LIABILITY|EQUITY|INCOME|EXPENSE)$")
  private String type;

  @NotBlank
  @Pattern(regexp = "^[A-Z]{3}$")
  private String currency;
}


