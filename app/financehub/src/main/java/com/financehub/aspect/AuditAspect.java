package com.financehub.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financehub.entity.AuditLog;
import com.financehub.tenancy.TenantContext;
import com.financehub.repository.AuditLogRepository;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
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

  private static final Set<String> SENSITIVE_KEYS = new HashSet<>();
  static {
    SENSITIVE_KEYS.add("password");
    SENSITIVE_KEYS.add("token");
    SENSITIVE_KEYS.add("secret");
    SENSITIVE_KEYS.add("authorization");
  }

  private String serializeAndRedact(Object obj) {
    try {
      Object redacted = redactSensitiveFields(obj);
      return objectMapper.writeValueAsString(redacted);
    } catch (Exception e) {
      return null;
    }
  }

  private Object redactSensitiveFields(Object obj) {
    if (obj == null) {
      return null;
    }
    if (obj instanceof Map<?, ?> map) {
      Map<Object, Object> copy = new java.util.LinkedHashMap<>();
      for (Map.Entry<?, ?> entry : map.entrySet()) {
        Object key = entry.getKey();
        if (key instanceof String keyStr && SENSITIVE_KEYS.contains(keyStr.toLowerCase())) {
          copy.put(key, "***");
        } else {
          copy.put(key, redactSensitiveFields(entry.getValue()));
        }
      }
      return copy;
    } else if (obj instanceof Iterable<?> iterable) {
      java.util.List<Object> list = new java.util.ArrayList<>();
      for (Object item : iterable) {
        list.add(redactSensitiveFields(item));
      }
      return list;
    } else if (obj != null && obj.getClass().isArray()) {
      int len = java.lang.reflect.Array.getLength(obj);
      Object arr = java.lang.reflect.Array.newInstance(obj.getClass().getComponentType(), len);
      for (int i = 0; i < len; i++) {
        java.lang.reflect.Array.set(arr, i, redactSensitiveFields(java.lang.reflect.Array.get(obj, i)));
      }
      return arr;
    } else if (isPrimitiveOrWrapper(obj.getClass()) || obj instanceof String) {
      return obj;
    } else {
      // For POJOs, use reflection to copy and redact fields
      try {
        Class<?> clazz = obj.getClass();
        Object copy = clazz.getDeclaredConstructor().newInstance();
        java.beans.BeanInfo beanInfo = java.beans.Introspector.getBeanInfo(clazz, Object.class);
        for (java.beans.PropertyDescriptor pd : beanInfo.getPropertyDescriptors()) {
          String name = pd.getName();
          if (SENSITIVE_KEYS.contains(name.toLowerCase())) {
            if (pd.getWriteMethod() != null) {
              pd.getWriteMethod().invoke(copy, "***");
            }
          } else if (pd.getReadMethod() != null && pd.getWriteMethod() != null) {
            Object value = pd.getReadMethod().invoke(obj);
            pd.getWriteMethod().invoke(copy, redactSensitiveFields(value));
          }
        }
        return copy;
      } catch (Exception e) {
        // Fallback: return as is if reflection fails
        return obj;
      }
    }
  }

  private boolean isPrimitiveOrWrapper(Class<?> clazz) {
    return clazz.isPrimitive() ||
      clazz == Boolean.class || clazz == Byte.class || clazz == Character.class ||
      clazz == Short.class || clazz == Integer.class || clazz == Long.class ||
      clazz == Float.class || clazz == Double.class;
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
