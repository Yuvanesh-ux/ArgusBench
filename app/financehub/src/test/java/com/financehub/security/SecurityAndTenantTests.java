package com.financehub.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.financehub.controller.HealthController;
import com.financehub.tenancy.TenantFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = HealthController.class)
@Import(TenantFilter.class)
class SecurityAndTenantTests {

  @Autowired private MockMvc mockMvc;

  @Test
  void health_withoutTenantHeader_isOk() throws Exception {
    mockMvc.perform(get("/health")).andExpect(status().isOk());
  }
}


