package com.example.FullStackDemo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Value;

@Value
public class AdminDecisionRequest {
    @NotBlank String decision;   // "ACCEPTED" or "REJECTED"
    String note;                 // optional
}
