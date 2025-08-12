package com.financehub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.header.writers.ContentSecurityPolicyHeaderWriter;
import org.springframework.security.web.server.header.ContentSecurityPolicyServerHttpHeadersWriter;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class WebSecurityHeadersConfig {
  @Bean
  public org.springframework.web.filter.ForwardedHeaderFilter forwardedHeaderFilter() {
    return new org.springframework.web.filter.ForwardedHeaderFilter();
  }
}


