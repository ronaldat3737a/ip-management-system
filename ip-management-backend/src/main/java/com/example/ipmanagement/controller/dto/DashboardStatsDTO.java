package com.example.ipmanagement.controller.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;

    public DashboardStatsDTO(long totalApplications, long pendingApplications, long approvedApplications, long rejectedApplications) {
        this.totalApplications = totalApplications;
        this.pendingApplications = pendingApplications;
        this.approvedApplications = approvedApplications;
        this.rejectedApplications = rejectedApplications;
    }
}
