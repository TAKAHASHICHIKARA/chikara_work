package com.example.store.infrastructure.dto;

public class BranchSummaryDto {
    private String branchName;
    private String areaName;
    private long totalBudget;
    private long totalActual;

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public String getAreaName() { return areaName; }
    public void setAreaName(String areaName) { this.areaName = areaName; }

    public long getTotalBudget() { return totalBudget; }
    public void setTotalBudget(long totalBudget) { this.totalBudget = totalBudget; }

    public long getTotalActual() { return totalActual; }
    public void setTotalActual(long totalActual) { this.totalActual = totalActual; }
}
