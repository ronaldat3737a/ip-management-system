package com.example.ipmanagement.controller;

import com.example.ipmanagement.controller.dto.DashboardStatsDTO;
import com.example.ipmanagement.service.ApplicationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ApplicationService applicationService;

    public DashboardController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping("/stats/{userId}")
    public DashboardStatsDTO getStats(@PathVariable Long userId) {
        return applicationService.getDashboardStats(userId);
    }
}
