package com.financehub.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financehub.entity.AuditLog;
import com.financehub.tenancy.TenantContext;
import com.financehub.repository.AuditLogRepository;
import java.lang.reflect.Method;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

  private final AuditLogRepository auditLogRepository;
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Around("execution(* com.financehub.service.*Service.create*(..)) || execution(* com.financehub.service.*Service.update*(..)) || execution(* com.financehub.service.*Service.delete*(..))")
  public Object aroundMutations(ProceedingJoinPoint pjp) throws Throwable {
    String tenantId = TenantContext.getTenantId();
    String action = pjp.getSignature().getName();
    String entity = pjp.getTarget().getClass().getSimpleName();

    String beforeJson = serializeAndRedact(pjp.getArgs());

    Object result = pjp.proceed();

    AuditLog log = new AuditLog();
    log.setTenantId(tenantId);
    log.setAction(action);
    log.setEntity(entity);
    log.setEntityId(resolveId(result));
    log.setBeforeJson(beforeJson);
    log.setAfterJson(serializeAndRedact(result));

    // Capture actor from SecurityContext (JWT preferred)
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null) {
      Object principal = auth.getPrincipal();
      if (principal instanceof Jwt jwt) {
        log.setUserId(jwt.getSubject());
      } else {
        log.setUserId(auth.getName());
      }
    }

    // Capture IP and User-Agent
    RequestAttributes ra = RequestContextHolder.getRequestAttributes();
    if (ra instanceof ServletRequestAttributes sra) {
      var req = sra.getRequest();
      log.setIp(req.getRemoteAddr());
      log.setUserAgent(req.getHeader("User-Agent"));
    }

    auditLogRepository.save(log);
    return result;
  }

  private String serializeAndRedact(Object obj) {
    try {
      String json = objectMapper.writeValueAsString(obj);
      // naive redaction: replace values for common sensitive keys
      json = json.replaceAll("\\\"password\\\"\\s*:\\s*\\\".*?\\\"", "\"password\":\"***\"");
      json = json.replaceAll("\\\"token\\\"\\s*:\\s*\\\".*?\\\"", "\"token\":\"***\"");
      json = json.replaceAll("\\\"secret\\\"\\s*:\\s*\\\".*?\\\"", "\"secret\":\"***\"");
      json = json.replaceAll("\\\"authorization\\\"\\s*:\\s*\\\".*?\\\"", "\"authorization\":\"***\"");
      return json;
    } catch (Exception e) {
      return null;
    }
  }

  private String resolveId(Object result) {
    if (result == null) return "n/a";
    try {
      if (result instanceof Map<?,?> map && map.containsKey("id")) {
        Object id = map.get("id");
        return id == null ? "n/a" : String.valueOf(id);
      }
      Method m = result.getClass().getMethod("getId");
      Object id = m.invoke(result);
      return id == null ? "n/a" : String.valueOf(id);
    } catch (Exception e) {
      return "n/a";
    }
  }
}


