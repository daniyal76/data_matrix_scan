package org.vaghar.ttac.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.vaghar.ttac.utils.TokenProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class SecurityFilter extends OncePerRequestFilter {

  private final TokenProvider tokenProvider;

  public SecurityFilter(TokenProvider tokenProvider) {
    this.tokenProvider = tokenProvider;
  }

  @Override
  public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

    if (!request.getRequestURL().toString().contains("api/authenticate")) {
      if (!hasAuthorizationBearer(request)) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        return;
      }
      String token = getAccessToken(request);

      if (!tokenProvider.validateToken(token)) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        return;
      }

      Authentication authentication =
        new UsernamePasswordAuthenticationToken(tokenProvider.getUsernameFromToken(token),"",new ArrayList<>());
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    filterChain.doFilter(request, response);
  }

  private boolean hasAuthorizationBearer(HttpServletRequest request) {
    String header = request.getHeader("Authorization");
    if (ObjectUtils.isEmpty(header) || !header.startsWith("Bearer")) {
      return false;
    }

    return true;
  }

  private String getAccessToken(HttpServletRequest request) {
    String header = request.getHeader("Authorization");
    String token = header.split(" ")[1].trim();
    return token;
  }

}
