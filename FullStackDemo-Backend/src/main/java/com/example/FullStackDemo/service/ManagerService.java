package com.example.FullStackDemo.service;

import com.example.FullStackDemo.model.RoleName;
import com.example.FullStackDemo.model.User;
import com.example.FullStackDemo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ManagerService {

    private final UserRepository userRepo;

    // 🔍 Get all unapproved Admins
    @Transactional
    public List<User> getPendingAdmins() {
        log.info("Manager fetching list of pending admins...");
        return userRepo.findByRoles_NameAndApprovedFalse(RoleName.ADMIN);
    }
    
    public List<User> getApprovedAdmins() {
        log.info("Manager fetching approved admins...");
        return userRepo.findByRoles_NameAndApprovedTrue(RoleName.ADMIN);
    }

    // ✅ Approve Admin
    @Transactional
    public void approveAdmin(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRoles().stream().noneMatch(r -> r.getName() == RoleName.ADMIN)) {
            throw new IllegalArgumentException("User is not an Admin");
        }

        user.setApproved(true);
        userRepo.save(user);

        log.info("✅ Manager approved Admin: {}", user.getEmail());
    }

    // ❌ Reject Admin
    @Transactional
    public void rejectAdmin(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRoles().stream().noneMatch(r -> r.getName() == RoleName.ADMIN)) {
            throw new IllegalArgumentException("User is not an Admin");
        }

        userRepo.delete(user);
        log.warn("❌ Manager rejected Admin: {}", user.getEmail());
    }
    
    public void removeApprovedAdmin(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        user.setApproved(false);
        userRepo.save(user);
        log.warn("🚫 Manager removed admin {}", user.getEmail());
    }
}
