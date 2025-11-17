package com.example.FullStackDemo.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ProductResponse {
    Long id;
    String name;
    String description;
    boolean active;
}
