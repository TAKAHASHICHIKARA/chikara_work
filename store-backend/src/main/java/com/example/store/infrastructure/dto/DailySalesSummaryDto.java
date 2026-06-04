package com.example.store.infrastructure.dto;

import java.time.LocalDate;

public class DailySalesSummaryDto {
    private LocalDate salesDate;
    private String areaName;
    private String branchName;
    private long budgetAmount;
    private long actualAmount;

    public LocalDate getSalesDate() { return salesDate; }
    public void setSalesDate(LocalDate salesDate) { this.salesDate = salesDate; }

    public String getAreaName() { return areaName; }
    public void setAreaName(String areaName) { this.areaName = areaName; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public long getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(long budgetAmount) { this.budgetAmount = budgetAmount; }

    public long getActualAmount() { return actualAmount; }
    public void setActualAmount(long actualAmount) { this.actualAmount = actualAmount; }
}
