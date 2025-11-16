package com.example.ipmanagement.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads");

    public FileStorageService() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public String store(MultipartFile file, UUID applicationId) throws IOException {
        Path applicationPath = root.resolve(applicationId.toString());
        if (!Files.exists(applicationPath)) {
            Files.createDirectory(applicationPath);
        }

        String filename = file.getOriginalFilename();
        Files.copy(file.getInputStream(), applicationPath.resolve(filename));
        return applicationPath.resolve(filename).toString();
    }

    public Path load(String filename) {
        return root.resolve(filename);
    }
}
