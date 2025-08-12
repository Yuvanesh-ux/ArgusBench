package com.financehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoleUpdateRequest {
  @NotBlank
  @Pattern(regexp = "^(ADMIN|MANAGER|USER)$", message = "role must be one of ADMIN, MANAGER, USER")
  private String role;
}


