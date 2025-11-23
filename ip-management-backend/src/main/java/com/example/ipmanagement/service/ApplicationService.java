package com.example.ipmanagement.service;

import com.example.ipmanagement.controller.dto.ApplicationDetailDTO;
import com.example.ipmanagement.controller.dto.ApplicationListDTO;
import com.example.ipmanagement.controller.dto.DashboardStatsDTO;
import com.example.ipmanagement.controller.dto.FileDTO;
import com.example.ipmanagement.model.Application;
import com.example.ipmanagement.model.ApplicationFile;
import com.example.ipmanagement.model.User;
import com.example.ipmanagement.repository.ApplicationFileRepository;
import com.example.ipmanagement.repository.ApplicationRepository;
import com.example.ipmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationFileRepository applicationFileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              ApplicationFileRepository applicationFileRepository,
                              UserRepository userRepository,
                              FileStorageService fileStorageService) {
        this.applicationRepository = applicationRepository;
        this.applicationFileRepository = applicationFileRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public ApplicationDetailDTO createApplication(String title, String description, Long userId, List<MultipartFile> files) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Application application = new Application();
        application.setTitle(title);
        application.setDescription(description);
        application.setSubmittedBy(user);
        application.setStatus("PENDING");
        application.setUuid(UUID.randomUUID());

        Application savedApplication = applicationRepository.save(application);

        Set<ApplicationFile> applicationFiles = new HashSet<>();
        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    String filePath = fileStorageService.store(file, savedApplication.getUuid());
                    ApplicationFile appFile = new ApplicationFile();
                    appFile.setFileName(file.getOriginalFilename());
                    appFile.setFileType(file.getContentType());
                    appFile.setFilePath(filePath);
                    appFile.setApplication(savedApplication);
                    applicationFiles.add(applicationFileRepository.save(appFile));
                }
            }
        }

        savedApplication.setFiles(applicationFiles);
        Application finalApplication = applicationRepository.save(savedApplication);
        
        return mapToApplicationDetailDTO(finalApplication);
    }

    @Transactional(readOnly = true)
    public List<ApplicationListDTO> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToApplicationListDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationListDTO> getApplicationsByUserId(Long userId) {
        return applicationRepository.findBySubmittedById(userId).stream()
                .map(this::mapToApplicationListDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationDetailDTO getApplicationByIdAsDTO(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));
        application.getFiles().size();
        return mapToApplicationDetailDTO(application);
    }

    @Transactional
    public ApplicationDetailDTO updateStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));
        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        updatedApplication.getFiles().size();
        return mapToApplicationDetailDTO(updatedApplication);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        long total = applicationRepository.countBySubmittedBy(user);
        long pending = applicationRepository.countByUserAndStatus(user, "PENDING");
        long approved = applicationRepository.countByUserAndStatus(user, "APPROVED");
        long rejected = applicationRepository.countByUserAndStatus(user, "REJECTED");

        return new DashboardStatsDTO(total, pending, approved, rejected);
    }

    private ApplicationListDTO mapToApplicationListDTO(Application app) {
        String username = (app.getSubmittedBy() != null) ? app.getSubmittedBy().getUsername() : "N/A";
        return new ApplicationListDTO(
                app.getId(),
                app.getTitle(),
                app.getStatus(),
                username
        );
    }

    private ApplicationDetailDTO mapToApplicationDetailDTO(Application application) {
        ApplicationDetailDTO dto = new ApplicationDetailDTO();
        dto.setId(application.getId());
        dto.setTitle(application.getTitle());
        dto.setDescription(application.getDescription());
        dto.setStatus(application.getStatus());
        String username = (application.getSubmittedBy() != null) ? application.getSubmittedBy().getUsername() : "N/A";
        dto.setSubmittedByUsername(username);

        List<FileDTO> fileDTOs = (application.getFiles() != null) ?
                application.getFiles().stream()
                        .map(file -> new FileDTO(file.getId(), file.getFileName()))
                        .collect(Collectors.toList()) :
                Collections.emptyList();
        dto.setFiles(fileDTOs);

        return dto;
    }
}
