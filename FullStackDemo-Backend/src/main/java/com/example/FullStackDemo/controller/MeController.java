package com.example.FullStackDemo.controller;

import com.example.FullStackDemo.dto.CreateProductRequest;
import com.example.FullStackDemo.dto.ProductRequestResponse;
import com.example.FullStackDemo.dto.ProfileResponse;
import com.example.FullStackDemo.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final RequestService requestService;

    @GetMapping("/requests")
    public ResponseEntity<List<ProductRequestResponse>> myRequests(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(requestService.myRequests(principal.getUsername()));
    }

    @PostMapping("/requests")
    public ResponseEntity<ProductRequestResponse> createRequest(@AuthenticationPrincipal User principal,
                                                                @Valid @RequestBody CreateProductRequest req) {
        return ResponseEntity.ok(requestService.createRequest(principal.getUsername(), req.getProductId()));
    }
    
    @GetMapping
    public ProfileResponse me(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        var roles = principal.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_",""))
                .toList();
        return ProfileResponse.builder()
                .email(principal.getUsername())
                .fullName("") // optional: pull from DB if you want the name too
                .roles(roles)
                .build();
    }

}
