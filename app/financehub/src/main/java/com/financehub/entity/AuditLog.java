package com.financehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "audit_logs")
public class AuditLog extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", length = 36)
  private String userId;

  @Column(nullable = false, length = 64)
  private String action;

  @Column(nullable = false, length = 64)
  private String entity;

  @Column(name = "entity_id", nullable = false, length = 64)
  private String entityId;

  @Column(name = "before", columnDefinition = "TEXT")
  private String beforeJson;

  @Column(name = "after", columnDefinition = "TEXT")
  private String afterJson;

  @Column(length = 64)
  private String ip;

  @Column(name = "user_agent", length = 256)
  private String userAgent;
}


