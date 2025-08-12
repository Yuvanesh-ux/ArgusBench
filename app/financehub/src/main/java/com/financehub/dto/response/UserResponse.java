package com.financehub.dto.response;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserResponse {
  private String id;
  private String email;
  private String firstName;
  private String lastName;
  private String role;
  private boolean active;
  private Instant lastLogin;
}


