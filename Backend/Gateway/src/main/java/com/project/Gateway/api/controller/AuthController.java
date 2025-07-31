package com.project.Gateway.api.controller;

import com.project.Gateway.dto.userLogin.LoginDTO;
import com.project.Gateway.dto.userLogin.RegisterDTO;
import com.project.Gateway.service.interfaces.IUserLoginService;
import com.project.common.dto.response.GenericResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IUserLoginService userLoginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginDTO loginDTO
    ) {
        return ResponseEntity.ok().body(userLoginService.authenticate(loginDTO));
    }

    @PostMapping("/signup")
    public ResponseEntity<GenericResponse<RegisterDTO>> signup(
            @RequestBody RegisterDTO registerDTO
    ) {
        return ResponseEntity.ok().body(userLoginService.register(registerDTO));
    }
}
