package com.project.Gateway.api.controller;

import com.project.Gateway.service.interfaces.IUserLoginService;
import com.project.common.dto.response.GenericResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/password")
@RequiredArgsConstructor
public class PasswordController {

    private final IUserLoginService userLoginService;

    @PostMapping("/forgot-password")
    public ResponseEntity<GenericResponse<String>> forgotPassword(@RequestBody String email) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userLoginService.forgetPassword(email));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<GenericResponse<String>> resetPassword(@RequestParam("token") String token, @RequestBody String email) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userLoginService.resetPassword(token, email));
    }

}
