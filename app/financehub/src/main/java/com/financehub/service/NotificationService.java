package com.financehub.service;

import com.financehub.entity.Notification;
import com.financehub.repository.NotificationRepository;
import com.financehub.tenancy.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {
  private final NotificationRepository notificationRepository;

  @Transactional
  public Long notify(String userId, String type, String payloadJson) {
    com.financehub.entity.Notification n = new com.financehub.entity.Notification();
    n.setTenantId(com.financehub.tenancy.TenantContext.getTenantId());
    n.setUserId(userId);
    n.setType(type);
    n.setPayloadJson(payloadJson);
    return notificationRepository.save(n).getId();
  }

  @Transactional(readOnly = true)
  public Page<Notification> list(int page, int size, String sort) {
    String tenantId = TenantContext.getTenantId();
    Sort s = Sort.by("createdAt").descending();
    if (sort != null && !sort.isBlank()) {
      s = Sort.by(sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC,
          sort.startsWith("-") ? sort.substring(1) : sort);
    }
    Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), s);
    return notificationRepository.findByTenantId(tenantId, pageable);
  }
}


