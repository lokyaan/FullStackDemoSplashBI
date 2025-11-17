package com.example.FullStackDemo.repository;

import com.example.FullStackDemo.model.RoleName;
import com.example.FullStackDemo.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.FullStackDemo.model.RoleName;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Load roles along with the user (fixes LazyInitializationException in login)
    @EntityGraph(attributePaths = "roles")
    Optional<User> findWithRolesByEmail(String email);


    // ✅ Find all users having a specific role name AND approved = true
    List<User> findByRoles_NameAndApprovedTrue(RoleName roleName);

    // ✅ Find all users having a specific role name AND approved = false
    List<User> findByRoles_NameAndApprovedFalse(RoleName roleName);

}
