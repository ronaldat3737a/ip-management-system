package com.example.ipmanagement.controller.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data // Lombok annotation to generate getters, setters, etc.
public class ApplicationRequestDto {
    private String title;
    private String description;
    private Long userId;
    private List<MultipartFile> files;
}