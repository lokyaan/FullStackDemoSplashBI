package com.example.FullStackDemo.service;

import com.example.FullStackDemo.dto.ProductRequestResponse;
import com.example.FullStackDemo.model.*;
import com.example.FullStackDemo.repository.ProductRequestRepository;
import com.example.FullStackDemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final ProductRequestRepository prRepo;
    private final UserRepository userRepo;
    private final ProductService productService;

    // CUSTOMER → list my requests
    @Transactional(readOnly = true)
    public List<ProductRequestResponse> myRequests(String email) {
        return prRepo.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(this::toDto)
                .toList();
    }

    // CUSTOMER → create a new request
    @Transactional
    public ProductRequestResponse createRequest(String email, Long productId) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Product product = productService.getOrThrow(productId);

        // Prevent duplicate PENDING for same product by same user
        if (prRepo.existsByUserIdAndProductIdAndStatus(user.getId(), product.getId(), RequestStatus.PENDING)) {
            throw new IllegalStateException("A pending request for this product already exists");
        }

        ProductRequest pr = ProductRequest.builder()
                .user(user)
                .product(product)
                .status(RequestStatus.PENDING)
                .build();

        return toDto(prRepo.save(pr));
    }

    // ADMIN → list requests by status
    @Transactional(readOnly = true)
    public List<ProductRequestResponse> listByStatusForAdmin(String adminEmail, RequestStatus status) {
        if (status == RequestStatus.PENDING) {
            // Pending ones aren't decided yet → visible to all admins
            return prRepo.findByStatusOrderByCreatedAtAsc(status)
                    .stream()
                    .map(this::toDto)
                    .toList();
        }

        // Accepted / Rejected → show only those decided by this admin
        return prRepo.findByDecidedByEmailAndStatusOrderByCreatedAtAsc(adminEmail, status)
                .stream()
                .map(this::toDto)
                .toList();
    }


    // ADMIN → decide (accept/reject)
    @Transactional
    public ProductRequestResponse decide(String adminEmail, Long requestId, RequestStatus decision, String note) {
        ProductRequest pr = prRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (pr.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Request already decided");
        }

        User admin = userRepo.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found"));

        pr.setStatus(decision);
        pr.setDecidedBy(admin);
        pr.setDecidedAt(Instant.now());
        pr.setAdminNote(note);

        // ✅ persist the update
        prRepo.save(pr);

        return toDto(pr);
    }


    private ProductRequestResponse toDto(ProductRequest pr) {
        var user = pr.getUser();       // requester
        var product = pr.getProduct(); // requested product

        return ProductRequestResponse.builder()
                .id(pr.getId())
                .productId(product.getId())
                .productName(product.getName())

                // NEW: expose requester
                .customerId(user.getId())
                .customerEmail(user.getEmail())
                .customerName(user.getFullName())

                .status(pr.getStatus().name())
                .createdAt(pr.getCreatedAt())
                .decidedAt(pr.getDecidedAt())
                .adminEmail(pr.getDecidedBy() != null ? pr.getDecidedBy().getEmail() : null)
                .adminNote(pr.getAdminNote())
                .build();
    }
    
    public Map<String, Long> getRequestSummaryByAdmin(Long adminId) {
        long accepted = prRepo.countByDecidedBy_IdAndStatus(adminId, RequestStatus.ACCEPTED);
        long rejected = prRepo.countByDecidedBy_IdAndStatus(adminId, RequestStatus.REJECTED);

        // pending requests aren't decided yet, so decidedBy is null
        long pending = prRepo.countByStatus(RequestStatus.PENDING);

        Map<String, Long> summary = new HashMap<>();
        summary.put("ACCEPTED", accepted);
        summary.put("REJECTED", rejected);
        summary.put("PENDING", pending);
        return summary;
    }
    @Transactional(readOnly = true)
    public List<ProductRequestResponse> getRequestsByStatus(String status) {
        var reqStatus = RequestStatus.valueOf(status.toUpperCase());
        return prRepo.findByStatusOrderByCreatedAtAsc(reqStatus)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // Admin API: Accept / Reject
    @Transactional
    public ProductRequestResponse decision(Long id, String decision, String adminEmail) {
        var reqStatus = RequestStatus.valueOf(decision.toUpperCase());
        return decide(adminEmail, id, reqStatus, "");
    }


}
