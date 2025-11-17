package com.example.FullStackDemo.dto;


import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class JwtResponse {
	String accessToken;
	String tokenType;//Bearer
	long expiresIn;
	String email;
	String fullName;
	List<String> roles;
}
