package com.financehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "files")
public class FileResource extends BaseEntity {
  @Id
  @Column(length = 36)
  private String id;

  @Column(name = "original_name", nullable = false, length = 255)
  private String originalName;

  @Column(nullable = false, length = 512)
  private String path;

  @Column(name = "mime_type", nullable = false, length = 128)
  private String mimeType;

  @Column(nullable = false)
  private long size;

  @Column(name = "uploaded_by", length = 36)
  private String uploadedBy;
}


