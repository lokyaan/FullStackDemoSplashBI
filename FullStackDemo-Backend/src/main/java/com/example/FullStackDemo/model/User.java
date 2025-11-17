package com.example.FullStackDemo.model;

import java.time.Instant;
import java.util.*;

import org.hibernate.annotations.*;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
@Entity
@Table(name="users",uniqueConstraints= {
		@UniqueConstraint(name="uk_user_email",columnNames="email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(name="full_name", length=120, nullable=false)
	private String fullName;
	
	@Column(name="email",length=255, nullable=false)
	private String email;
	
	@Column(name="password_hash", length=255, nullable=false)
	private String passwordHash;
	
	@Column(nullable=false)
	private boolean enabled=true;
	
	@CreationTimestamp
	@Column(name="created_at",updatable=false)
	private Instant createdAt;
	
	@UpdateTimestamp
	@Column(name="updated_at")
	private Instant updatedAt;
	
	@Builder.Default
    private boolean approved = false;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
	    name = "user_roles",
	    joinColumns = @JoinColumn(name = "user_id"),
	    inverseJoinColumns = @JoinColumn(name = "role_id")
	)
	private Set<Role> roles = new HashSet<>();

	
}
