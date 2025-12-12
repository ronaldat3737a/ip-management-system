package com.example.ipmanagement.controller.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private long totalApplications;
    private long inProgressApplications;
    private long reviewApplications;
    private long completedApplications;

    public DashboardStatsDTO(long totalApplications, long inProgressApplications, long reviewApplications, long completedApplications) {
        this.totalApplications = totalApplications;
        this.inProgressApplications = inProgressApplications;
        this.reviewApplications = reviewApplications;
        this.completedApplications = completedApplications;
    }
}
