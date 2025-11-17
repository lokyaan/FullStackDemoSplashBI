package com.example.FullStackDemo.controller;

import com.example.FullStackDemo.dto.ChangePasswordRequest;
import com.example.FullStackDemo.dto.JwtResponse;
import com.example.FullStackDemo.dto.LoginRequest;
import com.example.FullStackDemo.dto.SignUpRequest;
import com.example.FullStackDemo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Valid @RequestBody SignUpRequest req) {
        authService.signup(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
    
    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(
    	@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
    	@RequestBody ChangePasswordRequest req){
    	authService.changePassword(principal.getUsername(),req);
    	return ResponseEntity.ok("Password Changed Successfully");
    }
}
