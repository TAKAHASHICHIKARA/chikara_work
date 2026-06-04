package com.example.store.infrastructure.dto;

public class SystemDto {
    private long systemId;
    private String systemCode;
    private String systemName;
    private String systemNameEn;
    private String icon;
    private String color;
    private String category;
    private int sortOrder;
    private String role;

    public long getSystemId() { return systemId; }
    public void setSystemId(long systemId) { this.systemId = systemId; }

    public String getSystemCode() { return systemCode; }
    public void setSystemCode(String systemCode) { this.systemCode = systemCode; }

    public String getSystemName() { return systemName; }
    public void setSystemName(String systemName) { this.systemName = systemName; }

    public String getSystemNameEn() { return systemNameEn; }
    public void setSystemNameEn(String systemNameEn) { this.systemNameEn = systemNameEn; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
