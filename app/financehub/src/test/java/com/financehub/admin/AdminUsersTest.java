package com.financehub.admin;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.financehub.controller.AdminController;
import com.financehub.service.TenantService;
import com.financehub.service.UserService;
import com.financehub.tenancy.TenantFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AdminController.class)
@Import(TenantFilter.class)
class AdminUsersTest {

  @Autowired private MockMvc mockMvc;
  @MockBean private TenantService tenantService;
  @MockBean private UserService userService;

  @Test
  @WithMockUser(roles = {"ADMIN"})
  void createUser_requiresTenantHeader() throws Exception {
    String payload = "{\"email\":\"u@e.com\",\"firstName\":\"U\",\"lastName\":\"E\",\"role\":\"USER\"}";
    mockMvc.perform(post("/api/admin/users").contentType("application/json").content(payload))
        .andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser(roles = {"ADMIN"})
  void listUsers_okWithHeader() throws Exception {
    mockMvc.perform(get("/api/admin/users").header("X-Tenant-ID", "t1"))
        .andExpect(status().isOk());
  }
}


