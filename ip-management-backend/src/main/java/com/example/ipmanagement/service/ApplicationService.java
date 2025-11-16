package com.example.ipmanagement.service;

import com.example.ipmanagement.model.Application;
import com.example.ipmanagement.model.ApplicationFile;
import com.example.ipmanagement.model.User;
import com.example.ipmanagement.repository.ApplicationFileRepository;
import com.example.ipmanagement.repository.ApplicationRepository;
import com.example.ipmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

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

    public Application createApplication(String title, String description, Long userId, List<MultipartFile> files) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Application application = new Application();
        application.setTitle(title);
        application.setDescription(description);
        application.setSubmittedBy(user);
        application.setStatus("PENDING");
        application.setUuid(UUID.randomUUID());

        // Save application first to get an ID
        Application savedApplication = applicationRepository.save(application);

        Set<ApplicationFile> applicationFiles = new HashSet<>();
        for (MultipartFile file : files) {
            String filePath = fileStorageService.store(file, savedApplication.getUuid());
            ApplicationFile appFile = new ApplicationFile();
            appFile.setFileName(file.getOriginalFilename());
            appFile.setFileType(file.getContentType());
            appFile.setFilePath(filePath);
            appFile.setApplication(savedApplication);
            applicationFiles.add(applicationFileRepository.save(appFile));
        }

        savedApplication.setFiles(applicationFiles);
        return savedApplication;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application updateStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        return applicationRepository.save(application);
    }
    
    public Application getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
}
