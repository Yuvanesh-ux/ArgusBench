package com.financehub.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.financehub.config.SecurityConfig;
import com.financehub.controller.AuthController;
import com.financehub.tenancy.TenantFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = {AuthController.class})
@Import({SecurityConfig.class, TenantFilter.class})
class SecurityIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void me_withoutAuth_returns401() throws Exception {
    mockMvc.perform(get("/api/auth/me").header("X-Tenant-ID", "t1"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  @WithMockUser(roles = {"USER"})
  void protected_withAuthButNoJwt_stillAllowedByMockButHeaderRequired() throws Exception {
    mockMvc.perform(get("/api/auth/me").header("X-Tenant-ID", "t1"))
        .andExpect(status().isOk());
  }
}


