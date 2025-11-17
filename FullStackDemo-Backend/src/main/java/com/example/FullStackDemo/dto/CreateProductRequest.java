package com.example.FullStackDemo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class CreateProductRequest {
    @NotNull Long productId;
}
