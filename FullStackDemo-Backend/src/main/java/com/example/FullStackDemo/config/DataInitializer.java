package com.example.FullStackDemo.config;

import com.example.FullStackDemo.model.Role;
import com.example.FullStackDemo.model.RoleName;
import com.example.FullStackDemo.model.User;
import com.example.FullStackDemo.repository.RoleRepository;
import com.example.FullStackDemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // ✅ Ensure all roles exist
        for (RoleName roleName : RoleName.values()) {
            roleRepo.findByName(roleName)
                    .orElseGet(() -> {
                        Role r = Role.builder().name(roleName).build();
                        roleRepo.save(r);
                        log.info("✅ Created missing role: {}", roleName);
                        return r;
                    });
        }

        // ✅ Fetch manager role
        Role managerRole = roleRepo.findByName(RoleName.MANAGER).orElseThrow();

        // ✅ Seed default manager only (no admin auto-create)
        if (!userRepo.existsByEmail("manager@example.com")) {
            User manager = User.builder()
                    .fullName("Default Manager")
                    .email("manager@example.com")
                    .passwordHash(passwordEncoder.encode("manager123"))
                    .enabled(true)
                    .approved(true)
                    .roles(Set.of(managerRole))
                    .build();
            userRepo.save(manager);
            log.info("✅ Seeded Manager: manager@example.com / manager123");
        } else {
            log.info("✅ Default Manager already exists.");
        }
    }
}
