package com.example.FullStackDemo.repository;

import com.example.FullStackDemo.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRequestRepository extends JpaRepository<ProductRequest, Long> {

    // Customer views their requests
    List<ProductRequest> findByUserEmailOrderByCreatedAtDesc(String email);

    // Admin filters by status
    List<ProductRequest> findByStatusOrderByCreatedAtAsc(RequestStatus status);

    // Prevent duplicate pending requests for same product by same user (we'll use this in service)
    boolean existsByUserIdAndProductIdAndStatus(Long userId, Long productId, RequestStatus status);
    
    long countByDecidedBy_IdAndStatus(Long adminId, RequestStatus status);

    List<ProductRequest> findByDecidedByEmailAndStatusOrderByCreatedAtAsc(String email, RequestStatus status);

    long countByStatus(RequestStatus status);

    // ✅ Optional: Count all requests made by a specific user (customer)
    long countByUser_IdAndStatus(Long userId, RequestStatus status);

    
}
