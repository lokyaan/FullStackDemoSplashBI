package com.example.FullStackDemo.controller;

import com.example.FullStackDemo.model.User;
import com.example.FullStackDemo.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    // 🔍 Get all pending Admins
    @GetMapping("/pending-admins")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<User>> getPendingAdmins() {
        return ResponseEntity.ok(managerService.getPendingAdmins());
    }

    // ✅ Approve Admin
    @PutMapping("/approve/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<String> approveAdmin(@PathVariable Long id) {
        managerService.approveAdmin(id);
        return ResponseEntity.ok("Admin approved successfully");
    }

    // ❌ Reject Admin
    @DeleteMapping("/reject/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<String> rejectAdmin(@PathVariable Long id) {
        managerService.rejectAdmin(id);
        return ResponseEntity.ok("Admin rejected and deleted");
    }
    
 //  Get all approved Admins
    @GetMapping("/approved-admins")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<User>> getApprovedAdmins() {
        return ResponseEntity.ok(managerService.getApprovedAdmins());
    }
    
    @DeleteMapping("/remove-admin/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<String> removeApprovedAdmin(@PathVariable Long id) {
        managerService.removeApprovedAdmin(id);
        return ResponseEntity.ok("Admin removed successfully");
    }
    
}
