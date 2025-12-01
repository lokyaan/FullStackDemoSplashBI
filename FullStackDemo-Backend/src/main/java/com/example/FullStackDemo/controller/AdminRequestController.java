package com.example.FullStackDemo.controller;

import com.example.FullStackDemo.dto.ProductRequestResponse;
import com.example.FullStackDemo.service.RequestService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminRequestController {

    private final RequestService requestService;

    @GetMapping("/requests")
    public ResponseEntity<List<ProductRequestResponse>> filterRequests(
            @RequestParam @NotNull String status) {
        return ResponseEntity.ok(
                requestService.getRequestsByStatus(status)
        );
    }

    @PutMapping("/requests/{id}/decision")
    public ResponseEntity<ProductRequestResponse> decide(
            @PathVariable Long id,
            @RequestBody DecisionRequest req,
            @AuthenticationPrincipal User principal) {

        return ResponseEntity.ok(
                requestService.decision(id, req.decision(), principal.getUsername())
        );
    }
}

record DecisionRequest(String decision, String note) {}
