package com.financehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TenantRequest {
  @NotBlank
  @Size(max = 64)
  @Pattern(regexp = "^[a-z0-9-]+$", message = "slug must be lowercase alphanumeric and hyphens")
  private String slug;

  @NotBlank
  @Size(max = 128)
  private String name;
}


