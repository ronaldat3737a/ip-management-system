package com.example.ipmanagement.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import jakarta.persistence.*;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "applications")
@Data
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private UUID uuid;

    private String title;

    private String description;

    private String status; // e.g., "PENDING", "APPROVED", "REJECTED"

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User submittedBy;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<ApplicationFile> files;
}