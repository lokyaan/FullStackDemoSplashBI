package com.example.FullStackDemo.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ProductRequestResponse {
    Long id;
    Long productId;
    String productName;
    Long customerId;
    String customerEmail;
    String customerName;

    String status;       // PENDING/ACCEPTED/REJECTED
    Instant createdAt;
    Instant decidedAt;   // null if pending
    String adminEmail;   // null if pending
    String adminNote;    // optional
}
