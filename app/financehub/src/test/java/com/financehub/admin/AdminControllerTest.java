package com.financehub.admin;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.financehub.controller.AdminController;
import com.financehub.service.TenantService;
import com.financehub.tenancy.TenantFilter;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AdminController.class)
@Import(TenantFilter.class)
class AdminControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private TenantService tenantService;

  @Test
  void createTenant_withoutTenantHeader_allowedForBootstrap() throws Exception {
    String payload = "{\"slug\":\"t1\",\"name\":\"Tenant One\"}";
    mockMvc.perform(post("/api/admin/tenants").contentType("application/json").content(payload))
        .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(roles = {"ADMIN"})
  void listTenants_withAuthAndHeader_ok() throws Exception {
    mockMvc.perform(get("/api/admin/tenants").header("X-Tenant-ID", "t1"))
        .andExpect(status().isOk());
  }
}


