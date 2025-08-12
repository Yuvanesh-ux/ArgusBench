package com.financehub.accounts;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.financehub.controller.AccountController;
import com.financehub.service.AccountService;
import com.financehub.tenancy.TenantFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AccountController.class)
@Import(TenantFilter.class)
class AccountControllerTest {

  @Autowired private MockMvc mockMvc;
  @MockBean private AccountService accountService;

  @Test
  @WithMockUser(roles = {"USER"})
  void list_requiresTenantHeader() throws Exception {
    mockMvc.perform(get("/api/accounts")).andExpect(status().isBadRequest());
  }

  @Test
  @WithMockUser(roles = {"MANAGER"})
  void create_requiresTenantHeader() throws Exception {
    String payload = "{\"name\":\"Cash\",\"type\":\"ASSET\",\"currency\":\"USD\"}";
    mockMvc.perform(post("/api/accounts").contentType("application/json").content(payload))
        .andExpect(status().isBadRequest());
  }
}


