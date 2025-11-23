package com.example.ipmanagement.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@ToString(exclude = "applications")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "USER" hoặc "REVIEWER"

    @OneToMany(mappedBy = "submittedBy")
    @JsonManagedReference
    private Set<Application> applications;
}