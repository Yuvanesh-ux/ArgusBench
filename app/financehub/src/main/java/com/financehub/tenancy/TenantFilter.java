package com.financehub.tenancy;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import com.financehub.repository.TenantRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.financehub.entity.User;

@Component
@Order(10)
public class TenantFilter extends OncePerRequestFilter {

  public static final String TENANT_HEADER = "X-Tenant-ID";

  @Autowired
  private TenantRepository tenantRepository;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    try {
      String tenantId = request.getHeader(TENANT_HEADER);
      // Allow unauthenticated health/actuator paths without tenant header
      String path = request.getRequestURI();
      boolean publicPath = path.equals("/health") || path.startsWith("/actuator") ||
          ("POST".equalsIgnoreCase(request.getMethod()) && path.equals("/api/admin/tenants"));
      if (!publicPath) {
        if (tenantId == null || tenantId.isBlank() || tenantRepository.findBySlugAndActiveTrue(tenantId).isEmpty()) {
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or inactive tenant");
          return;
        }
      }
        if (tenantRepository.findBySlugAndActiveTrue(tenantId).isEmpty()) {
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or inactive tenant");
          return;
        }
        // Bind tenantId to authenticated user's tenant
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated");
          return;
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid user principal");
          return;
        }
        User user = (User) principal;
        if (user.getTenantId() == null || !tenantId.equals(user.getTenantId())) {
          response.sendError(HttpServletResponse.SC_FORBIDDEN, "User does not have access to tenant");
          return;
        }
      }
      TenantContext.setTenantId(tenantId);
      filterChain.doFilter(request, response);
    } finally {
      TenantContext.clear();
    }
  }
}