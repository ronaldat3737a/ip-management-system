package com.example.ipmanagement.controller.dto;

import lombok.Data;
import java.util.List;

@Data
public class ApplicationDetailDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String rejectionReason;
    private String submittedByUsername;
    private List<FileDTO> files;
}
