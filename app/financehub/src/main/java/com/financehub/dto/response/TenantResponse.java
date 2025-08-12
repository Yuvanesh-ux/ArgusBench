package com.financehub.dto.response;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TenantResponse {
  private String id;
  private String slug;
  private String name;
  private boolean active;
  private Instant createdAt;
}


