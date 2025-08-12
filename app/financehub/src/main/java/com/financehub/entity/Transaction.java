package com.financehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "transactions")
public class Transaction extends BaseEntity {
  public enum Status { PENDING, POSTED, REVERSED }

  @Id
  @Column(length = 36)
  private String id;

  @Column(length = 64)
  private String reference;

  @Column(name = "posted_at")
  private Instant postedAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private Status status = Status.PENDING;

  @Column(name = "created_by", length = 36)
  private String createdBy;

  @Column(name = "idempotency_key", length = 128)
  private String idempotencyKey;
}


