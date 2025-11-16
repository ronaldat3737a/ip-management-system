package com.example.ipmanagement.repository;

import com.example.ipmanagement.model.ApplicationFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationFileRepository extends JpaRepository<ApplicationFile, Long> {
    List<ApplicationFile> findByApplicationId(Long applicationId);
}
