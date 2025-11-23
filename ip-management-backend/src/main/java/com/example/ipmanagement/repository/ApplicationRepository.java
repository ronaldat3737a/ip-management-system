package com.example.ipmanagement.repository;

import com.example.ipmanagement.model.Application;
import com.example.ipmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStatus(String status);
    List<Application> findBySubmittedById(Long userId);

    long countBySubmittedBy(User user);

    @Query("SELECT count(a) FROM Application a WHERE a.submittedBy = :user AND a.status = :status")
    long countByUserAndStatus(@Param("user") User user, @Param("status") String status);
}