package org.vaghar.ttac.service;

import lombok.RequiredArgsConstructor;
import org.vaghar.ttac.dto.LoginDto;
import org.vaghar.ttac.utils.TokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final AuthenticationManager authenticationManager;
  private final UserDetailsService userDetailsService;
  private final TokenProvider tokenProvider;

  public String authenticate(LoginDto loginDto) throws Exception {
    doAuthentication(loginDto.getUsername(),loginDto.getPassword());
    UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getUsername());
    return tokenProvider.generate(userDetails);
  }

  private void doAuthentication(String username, String password) throws Exception {
    try {
      Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    } catch (DisabledException e) {
      throw new Exception("USER_DISABLED", e);
    } catch (BadCredentialsException e) {
      throw new Exception("INVALID_CREDENTIALS", e);
    }

  }
}
