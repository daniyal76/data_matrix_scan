package org.vaghar.ttac.controller;

import lombok.RequiredArgsConstructor;
import org.vaghar.ttac.dto.LoginDto;
import org.vaghar.ttac.service.AuthenticationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/")
public class AuthenticationController {

  private final AuthenticationService authenticationService;

  @PostMapping("authenticate")
  public String authenticate(@RequestBody LoginDto loginDto) throws Exception {
    return authenticationService.authenticate(loginDto);
  }
}
