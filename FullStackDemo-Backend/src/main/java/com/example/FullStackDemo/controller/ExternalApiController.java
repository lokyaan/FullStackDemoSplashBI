package com.example.FullStackDemo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.FullStackDemo.model.AgifyResponse;

@RestController
@CrossOrigin(origins="http://localhost:5173")
@RequestMapping("api/proxy")
public class ExternalApiController {

	@GetMapping("/agify")
	public ResponseEntity<Map<String, Integer>> getAge(@RequestParam("name") String name) {
	    try {
	        String url = "https://api.agify.io/?name=" + name;
	        RestTemplate restTemplate = new RestTemplate();
	        AgifyResponse res = restTemplate.getForObject(url, AgifyResponse.class);

	        return ResponseEntity.ok(Map.of("age", res != null ? res.age() : null));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(500).body(Map.of("error", -1));
	    }
	}

}
