import com.example.ipmanagement.controller.dto.ApplicationDetailDTO;
import com.example.ipmanagement.controller.dto.ApplicationListDTO;
import com.example.ipmanagement.controller.dto.FileDTO;
import com.example.ipmanagement.model.Application;
import com.example.ipmanagement.model.ApplicationFile;
import com.example.ipmanagement.model.User;
import com.example.ipmanagement.repository.ApplicationFileRepository;
import com.example.ipmanagement.repository.ApplicationRepository;
import com.example.ipmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
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
        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
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
        return savedApplication;
    }

    public List<ApplicationListDTO> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToApplicationListDTO)
                .collect(Collectors.toList());
    }

    public ApplicationDetailDTO getApplicationByIdAsDTO(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return mapToApplicationDetailDTO(application);
    }
    
    public ApplicationDetailDTO updateStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        return mapToApplicationDetailDTO(updatedApplication);
    }

    private ApplicationListDTO mapToApplicationListDTO(Application app) {
        return new ApplicationListDTO(
                app.getId(),
                app.getTitle(),
                app.getStatus(),
                app.getSubmittedBy() != null ? app.getSubmittedBy().getUsername() : "N/A"
        );
    }

    private ApplicationDetailDTO mapToApplicationDetailDTO(Application application) {
        ApplicationDetailDTO dto = new ApplicationDetailDTO();
        dto.setId(application.getId());
        dto.setTitle(application.getTitle());
        dto.setDescription(application.getDescription());
        dto.setStatus(application.getStatus());
        dto.setSubmittedByUsername(application.getSubmittedBy() != null ? application.getSubmittedBy().getUsername() : "N/A");

        List<FileDTO> fileDTOs = application.getFiles() != null ?
                application.getFiles().stream()
                        .map(file -> new FileDTO(file.getId(), file.getFileName()))
                        .collect(Collectors.toList()) :
                Collections.emptyList();
        dto.setFiles(fileDTOs);

        return dto;
    }
}