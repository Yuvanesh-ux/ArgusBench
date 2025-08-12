package com.financehub.security;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;

public class AuthoritiesMapper implements GrantedAuthoritiesMapper {

  @Override
  public Collection<? extends GrantedAuthority> mapAuthorities(
      Collection<? extends GrantedAuthority> authorities) {
    // Map incoming authorities/claims to application roles; default to ROLE_USER
    Set<String> src = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
    // Example mappings; adjust per IdP claim conventions
    boolean isAdmin = src.contains("ROLE_admin") || src.contains("SCOPE_admin") || src.contains("admin");
    boolean isManager = src.contains("ROLE_manager") || src.contains("SCOPE_manager") || src.contains("manager");

    if (isAdmin) {
      return Set.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
    } else if (isManager) {
      return Set.of(new SimpleGrantedAuthority("ROLE_MANAGER"));
    }
    return Set.of(new SimpleGrantedAuthority("ROLE_USER"));
  }
}


