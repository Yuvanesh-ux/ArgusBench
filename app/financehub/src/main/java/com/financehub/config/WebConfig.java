package com.financehub.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class WebConfig {
  @Bean
  public java.util.Optional<HttpServletRequest> currentRequest() {
    ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    if (attrs != null) {
      HttpServletRequest request = attrs.getRequest();
      if (request != null) {
        return java.util.Optional.of(request);
      }
    }
    return java.util.Optional.empty();
  }
}
