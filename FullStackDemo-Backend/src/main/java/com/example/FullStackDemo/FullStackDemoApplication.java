package com.example.FullStackDemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example")
public class FullStackDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(FullStackDemoApplication.class, args);
	}

}
