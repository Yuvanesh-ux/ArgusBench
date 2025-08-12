package com.financehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "accounts")
public class Account extends BaseEntity {

  public enum Type { ASSET, LIABILITY, EQUITY, INCOME, EXPENSE }

  @Id
  @Column(length = 36)
  private String id;

  @Column(nullable = false, length = 128)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private Type type;

  @Column(nullable = false, length = 3)
  private String currency;

  @Column(nullable = false)
  private java.math.BigDecimal balance;

  @Column(nullable = false)
  private Long version;
}


