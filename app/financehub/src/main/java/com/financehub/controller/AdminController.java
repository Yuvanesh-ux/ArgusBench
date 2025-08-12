package com.financehub.controller;

import com.financehub.dto.request.TenantRequest;
import com.financehub.dto.response.TenantResponse;
import com.financehub.dto.request.UserRequest;
import com.financehub.dto.request.UserRoleUpdateRequest;
import com.financehub.dto.response.UserResponse;
import com.financehub.service.TenantService;
import com.financehub.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

  private final TenantService tenantService;
  private final UserService userService;
  private final com.financehub.repository.AuditLogRepository auditLogRepository;

  // Allow bootstrap creation without auth; TenantFilter permits this path
  @PostMapping("/tenants")
  public ResponseEntity<TenantResponse> createTenant(@Valid @RequestBody TenantRequest req) {
    return ResponseEntity.ok(tenantService.createTenant(req));
  }

  @GetMapping("/tenants")
  @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
  public ResponseEntity<List<TenantResponse>> listTenants() {
    return ResponseEntity.ok(tenantService.listTenants());
  }

  @PostMapping("/users")
  @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
  public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest req) {
    return ResponseEntity.ok(userService.create(req));
  }

  @GetMapping("/users")
  @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
  public ResponseEntity<List<UserResponse>> listUsers() {
    return ResponseEntity.ok(userService.list());
  }

  @PostMapping("/users/{id}/role")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> updateUserRole(
      @org.springframework.web.bind.annotation.PathVariable("id") String userId,
      @Valid @RequestBody UserRoleUpdateRequest req) {
    return ResponseEntity.ok(userService.updateRole(userId, req.getRole()));
  }

  @GetMapping("/audit")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<org.springframework.data.domain.Page<com.financehub.entity.AuditLog>> listAudit(
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "20") int size,
      @RequestParam(name = "sort", required = false) String sort
  ) {
    String tenantId = com.financehub.tenancy.TenantContext.getTenantId();
    var s = org.springframework.data.domain.Sort.by("createdAt").descending();
    if (sort != null && !sort.isBlank()) {
      s = org.springframework.data.domain.Sort.by(sort.startsWith("-") ? org.springframework.data.domain.Sort.Direction.DESC : org.springframework.data.domain.Sort.Direction.ASC,
          sort.startsWith("-") ? sort.substring(1) : sort);
    }
    var pageable = org.springframework.data.domain.PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), s);
    return ResponseEntity.ok(auditLogRepository.findByTenantId(tenantId, pageable));
  }
}


