// src/main/java/.../config/RequestIdFilter.java
package com.example.FullStackDemo.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class RequestIdFilter implements Filter {
  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
      throws IOException, ServletException {
    String reqId = UUID.randomUUID().toString().substring(0,8);
    MDC.put("reqId", "[" + reqId + "]");
    try {
      chain.doFilter(req, res);
    } finally {
      MDC.clear();
    }
  }
}
