package com.financehub.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(2)
public class RateLimitFilter extends OncePerRequestFilter {

  private static final int LIMIT = 100; // 100 req / minute per IP
  private static final Map<String, Window> WINDOWS = new ConcurrentHashMap<>();

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String ip = request.getRemoteAddr();
    long now = Instant.now().getEpochSecond();
    long minute = now / 60;
    Window w = WINDOWS.computeIfAbsent(ip, k -> new Window(minute));
    synchronized (w) {
      if (w.minute != minute) {
        w.minute = minute;
        w.count.set(0);
      }
      if (w.count.incrementAndGet() > LIMIT) {
        response.setStatus(429);
        response.getWriter().write("Rate limit exceeded");
        return;
      }
    }
    filterChain.doFilter(request, response);
  }

  static class Window {
    volatile long minute;
    AtomicInteger count = new AtomicInteger();
    Window(long m) { this.minute = m; }
  }
}


