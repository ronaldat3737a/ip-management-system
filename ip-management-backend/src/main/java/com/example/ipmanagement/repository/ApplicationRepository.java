package com.example.ipmanagement.repository;

import com.example.ipmanagement.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStatus(String status);
    List<Application> findBySubmittedById(Long userId);
}
