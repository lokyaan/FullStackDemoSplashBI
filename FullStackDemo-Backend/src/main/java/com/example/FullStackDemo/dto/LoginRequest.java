package com.example.FullStackDemo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

//@Value
@Data @NoArgsConstructor @AllArgsConstructor
public class LoginRequest {
	@NotBlank
	@Email
	@Size(max=160)
	String email;
	
	@NotBlank
	@Size(min=8,max=128)
	String password;
}
