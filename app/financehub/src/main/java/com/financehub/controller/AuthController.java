package com.financehub.controller;

import java.security.Principal;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
      return ResponseEntity.status(401).build();
    }
    // Sanitized minimal shape
    return ResponseEntity.ok(Map.of(
        "sub", jwt.getSubject(),
        "email", jwt.getClaimAsString("email"),
        "name", jwt.getClaimAsString("name")
    ));
  }
}


