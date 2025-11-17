package com.example.FullStackDemo.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="roles",uniqueConstraints= {
		@UniqueConstraint(name="uk_role_name",columnNames="name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

		@Id
		@GeneratedValue(strategy=GenerationType.IDENTITY)
		private long id;
		
		@Enumerated(EnumType.STRING)
		@Column(nullable=false,length=32)
		private RoleName name;
}
