package com.financehub.config;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {
  public MetricsConfig(MeterRegistry registry, @Value("${spring.application.name:financehub}") String appName) {
    registry.config().commonTags("application", appName);
  }
}


