package com.example.FullStackDemo.controller;

import com.example.FullStackDemo.dto.AdminDecisionRequest;
import com.example.FullStackDemo.dto.ProductRequestResponse;
import com.example.FullStackDemo.model.AgifyResponse;
import com.example.FullStackDemo.model.RequestStatus;
import com.example.FullStackDemo.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final RequestService requestService;

    //  Admin → list requests filtered by status
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/requests")
    public ResponseEntity<List<ProductRequestResponse>> listByStatus(
            @RequestParam(defaultValue = "PENDING") String status,
            @AuthenticationPrincipal User admin) {

        RequestStatus rs = RequestStatus.valueOf(status.toUpperCase());
        // use the new method with admin email
        return ResponseEntity.ok(requestService.listByStatusForAdmin(admin.getUsername(), rs));
    }

    //  Admin → approve or reject a request
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/requests/{id}/decision")
    public ResponseEntity<ProductRequestResponse> decide(
            @PathVariable Long id,
            @Valid @RequestBody AdminDecisionRequest req,
            @AuthenticationPrincipal User admin) {

        RequestStatus rs = RequestStatus.valueOf(req.getDecision().toUpperCase());
        return ResponseEntity.ok(requestService.decide(admin.getUsername(), id, rs, req.getNote()));
    }

    //  Manager → view summary (counts)
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/{adminId}/requests-summary")
    public ResponseEntity<Map<String, Long>> getRequestsSummary(@PathVariable Long adminId) {
        Map<String, Long> summary = requestService.getRequestSummaryByAdmin(adminId);
        return ResponseEntity.ok(summary);
    }
    
    
   
}
