package com.financehub.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {
  @Bean
  public java.util.Optional<HttpServletRequest> currentRequest() {
    return java.util.Optional.empty();
  }
}


