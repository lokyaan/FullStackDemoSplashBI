package com.example.FullStackDemo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;   // customer who made the request

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private Instant createdAt;
    private Instant decidedAt;

    @ManyToOne
    @JoinColumn(name = "decided_by_id")
    private User decidedBy; //  Admin who accepted/rejected the request

    private String adminNote;
}
