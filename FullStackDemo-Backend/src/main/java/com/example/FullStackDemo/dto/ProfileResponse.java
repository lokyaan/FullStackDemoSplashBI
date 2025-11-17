package com.example.FullStackDemo.dto;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class ProfileResponse {
    String email;
    String fullName;
    List<String> roles; // ["ADMIN"] or ["CUSTOMER"]
}
