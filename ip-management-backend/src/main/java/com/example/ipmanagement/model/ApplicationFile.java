package com.example.ipmanagement.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import jakarta.persistence.*;

@Entity
@Table(name = "application_files")
@Getter
@Setter
@ToString(exclude = "application")
public class ApplicationFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileType;

    private String filePath;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    @JsonBackReference
    private Application application;
}