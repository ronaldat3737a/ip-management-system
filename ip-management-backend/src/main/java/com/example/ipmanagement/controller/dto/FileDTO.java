package com.example.ipmanagement.controller.dto;

import lombok.Data;

@Data
public class FileDTO {
    private Long id;
    private String fileName;

    public FileDTO(Long id, String fileName) {
        this.id = id;
        this.fileName = fileName;
    }
}
