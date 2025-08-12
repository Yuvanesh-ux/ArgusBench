package com.financehub.service;

import com.financehub.dto.request.TenantRequest;
import com.financehub.dto.response.TenantResponse;
import com.financehub.entity.Tenant;
import com.financehub.repository.TenantRepository;
import com.financehub.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TenantService {
  private final TenantRepository tenantRepository;
  private final UserRepository userRepository;

  @Transactional
  public TenantResponse createTenant(TenantRequest req) {
    Tenant t = new Tenant();
    t.setId(UUID.randomUUID().toString());
    t.setSlug(req.getSlug());
    t.setName(req.getName());
    t.setActive(true);
    Tenant saved = tenantRepository.save(t);
    // Bootstrap admin if env provided
    String adminEmail = System.getenv("FINANCEHUB_BOOTSTRAP_ADMIN_EMAIL");
    String adminFirst = System.getenv().getOrDefault("FINANCEHUB_BOOTSTRAP_ADMIN_FIRST", "Admin");
    String adminLast = System.getenv().getOrDefault("FINANCEHUB_BOOTSTRAP_ADMIN_LAST", "User");
    if (adminEmail != null && !adminEmail.isBlank()) {
      com.financehub.entity.User u = new com.financehub.entity.User();
      u.setId(UUID.randomUUID().toString());
      u.setTenantId(saved.getId());
      u.setEmail(adminEmail.toLowerCase());
      u.setFirstName(adminFirst);
      u.setLastName(adminLast);
      u.setRole("ADMIN");
      userRepository.save(u);
    }
    return new TenantResponse(saved.getId(), saved.getSlug(), saved.getName(), saved.isActive(), saved.getCreatedAt());
  }

  @Transactional(readOnly = true)
  public List<TenantResponse> listTenants() {
    return tenantRepository.findAll().stream()
        .map(t -> new TenantResponse(t.getId(), t.getSlug(), t.getName(), t.isActive(), t.getCreatedAt()))
        .toList();
  }
}


