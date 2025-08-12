package com.financehub.tenancy;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(10)
public class TenantFilter extends OncePerRequestFilter {

  public static final String TENANT_HEADER = "X-Tenant-ID";

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
        if (tenantId == null || tenantId.isBlank()) {
          response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing X-Tenant-ID header");
          return;
        }
        // Could validate tenant active here; defer to Phase 3 to avoid repository coupling in filter
      }
      TenantContext.setTenantId(tenantId);
      filterChain.doFilter(request, response);
    } finally {
      TenantContext.clear();
    }
  }
}


