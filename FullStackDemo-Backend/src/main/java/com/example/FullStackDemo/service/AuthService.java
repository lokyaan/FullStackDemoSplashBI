package com.example.FullStackDemo.service;

import com.example.FullStackDemo.dto.ChangePasswordRequest;
import com.example.FullStackDemo.dto.JwtResponse;
import com.example.FullStackDemo.dto.LoginRequest;
import com.example.FullStackDemo.dto.SignUpRequest;
import com.example.FullStackDemo.model.Role;
import com.example.FullStackDemo.model.RoleName;
import com.example.FullStackDemo.model.User;
import com.example.FullStackDemo.repository.RoleRepository;
import com.example.FullStackDemo.repository.UserRepository;
import com.example.FullStackDemo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 🧩 SIGNUP LOGIC (Customer auto-approves, Admin needs Manager approval)
    @Transactional
    public void signup(SignUpRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        Role assignedRole;
        boolean approvedFlag;

        // Decide role based on frontend input
        if ("ADMIN".equalsIgnoreCase(req.getRole())) {
            assignedRole = roleRepo.findByName(RoleName.ADMIN)
                    .orElseThrow(() -> new IllegalStateException("Missing ADMIN role"));
            approvedFlag = false; // needs manager approval
            log.info("New admin signup pending approval: {}", req.getEmail());
        } else if ("CUSTOMER".equalsIgnoreCase(req.getRole())) {
            assignedRole = roleRepo.findByName(RoleName.CUSTOMER)
                    .orElseThrow(() -> new IllegalStateException("Missing CUSTOMER role"));
            approvedFlag = true; // auto-approve customers
            log.info("New customer registered: {}", req.getEmail());
        } else {
            throw new IllegalArgumentException("Invalid role type. Must be ADMIN or CUSTOMER.");
        }

        User u = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .enabled(true)
                .approved(approvedFlag)
                .roles(Set.of(assignedRole))
                .build();

        userRepo.save(u);
        log.info("User saved: {} (role={}, approved={})", req.getEmail(), req.getRole(), approvedFlag);
    }

    // 🧩 LOGIN LOGIC (Blocks unapproved users)
    @Transactional(readOnly = true)
    public JwtResponse login(LoginRequest req) {
        User user = userRepo.findWithRolesByEmail(req.getEmail())
                .orElseThrow(() -> {
                    log.error("Login failed: user not found for email={}", req.getEmail());
                    return new UsernameNotFoundException("User not found");
                });

        // Password check
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            log.error("Login failed: bad credentials for email={}", req.getEmail());
            throw new BadCredentialsException("Invalid credentials");
        }

        // Prevent unapproved users from logging in
        if (!user.isApproved()) {
            log.warn("Login blocked: user={} awaiting manager approval", user.getEmail());
            throw new IllegalStateException("Awaiting manager approval");
        }

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .toList();

        String token = jwtUtil.generateToken(user.getEmail(), roles);

        log.info("User logged in successfully: {} (roles={})", user.getEmail(), roles);

        return JwtResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getExpirationMs())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .build();
    }
    
    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
    	if(!req.getNewPassword().equals(req.getConfirmPassword())) {
    		throw new IllegalArgumentException("New Password and confirmation do not match");
    	}
    	User user=userRepo.findByEmail(email)
    					.orElseThrow(()->new IllegalArgumentException("User not found"));
    	
    	
    	if(!passwordEncoder.matches(req.getCurrentPassword(),user.getPasswordHash())) {
    		throw new IllegalArgumentException("Current password is InCorrect");
    	}
    	
    	
    	user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
    	userRepo.save(user);
    }
}
