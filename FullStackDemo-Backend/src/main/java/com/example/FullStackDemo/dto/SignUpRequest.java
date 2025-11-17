package com.example.FullStackDemo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

//@Value  //Make all fields private final, provide(Constructors,getters,equals,toString),Do not provide setters so cant change value later
@Data @NoArgsConstructor @AllArgsConstructor
public class SignUpRequest {
	@NotBlank
	@Size(min=2,max=120)
	String fullName;
	
	@NotBlank
	@Email
	@Size(max=160)
	String email;
	
	@NotBlank
	@Size(min=8,max=128)
	String password;
	
	@NotBlank
    private String role; 
}
