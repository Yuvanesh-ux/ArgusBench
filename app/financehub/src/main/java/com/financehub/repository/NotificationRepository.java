package com.financehub.repository;

import com.financehub.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
  Page<Notification> findByTenantId(String tenantId, Pageable pageable);
  java.util.Optional<Notification> findByTenantIdAndId(String tenantId, Long id);
}


