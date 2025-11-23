package com.example.ipmanagement.controller.dto;

import lombok.Data;

@Data
public class ApplicationListDTO {
    private Long id;
    private String title;
    private String status;
    private String submittedByUsername;

    public ApplicationListDTO(Long id, String title, String status, String submittedByUsername) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.submittedByUsername = submittedByUsername;
    }
}
