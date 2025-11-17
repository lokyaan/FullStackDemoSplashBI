package com.example.FullStackDemo.service;

import com.example.FullStackDemo.dto.ProductResponse;
import com.example.FullStackDemo.model.Product;
import com.example.FullStackDemo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepo;

    public List<ProductResponse> listActive() {
        return productRepo.findByActiveTrue().stream()
                .map(p -> ProductResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .description(p.getDescription())
                        .active(p.isActive())
                        .build())
                .toList();
    }

    public Product getOrThrow(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }
}
