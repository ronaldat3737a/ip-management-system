package com.example.ipmanagement.controller;

import com.example.ipmanagement.controller.dto.ApplicationDetailDTO;
import com.example.ipmanagement.controller.dto.ApplicationListDTO;
import com.example.ipmanagement.controller.dto.ApplicationRequestDto;
import com.example.ipmanagement.model.ApplicationFile;
import com.example.ipmanagement.repository.ApplicationFileRepository;
import com.example.ipmanagement.service.ApplicationService;
import com.example.ipmanagement.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final FileStorageService fileStorageService;
    private final ApplicationFileRepository applicationFileRepository;

    public ApplicationController(ApplicationService applicationService, FileStorageService fileStorageService, ApplicationFileRepository applicationFileRepository) {
        this.applicationService = applicationService;
        this.fileStorageService = fileStorageService;
        this.applicationFileRepository = applicationFileRepository;
    }

    @PostMapping
    public ResponseEntity<?> submitApplication(@ModelAttribute ApplicationRequestDto request) {
        try {
            ApplicationDetailDTO application = applicationService.createApplication(
                    request.getTitle(), request.getDescription(), request.getUserId(), request.getFiles()
            );
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            // Log the stack trace to see the actual error on the server side
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to submit application: " + e.getMessage());
        }
    }

    @GetMapping
    public List<ApplicationListDTO> getAllApplications(@RequestParam(required = false) String status) {
        return applicationService.getAllApplications(status);
    }

    @GetMapping("/user/{userId}")
    public List<ApplicationListDTO> getApplicationsByUserId(@PathVariable Long userId) {
        return applicationService.getApplicationsByUserId(userId);
    }

    @GetMapping("/{id}")
    public ApplicationDetailDTO getApplication(@PathVariable Long id) {
        return applicationService.getApplicationByIdAsDTO(id);
    }

    @GetMapping("/files/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) throws MalformedURLException {
        ApplicationFile fileInfo = applicationFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));

        // This assumes the file path stored is just the name, and the UUID is in the Application
        // This is a potential bug if fileInfo.getApplication() is lazy loaded and not in a transaction
        Path filePath = fileStorageService.load(fileInfo.getApplication().getUuid(), fileInfo.getFileName());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Could not read file: " + fileInfo.getFileName());
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileInfo.getFileName() + "\"")
                .body(resource);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationDetailDTO> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        try {
            ApplicationDetailDTO updated = applicationService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            // In a real app, you'd have more specific exception handling
            throw new RuntimeException("Failed to update status", e);
        }
    }
}