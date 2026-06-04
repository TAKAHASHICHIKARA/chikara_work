package com.example.store.infrastructure.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private long notificationId;
    private String userId;
    private String title;
    private String body;
    private boolean read;
    private LocalDateTime createdAt;

    public long getNotificationId() { return notificationId; }
    public void setNotificationId(long notificationId) { this.notificationId = notificationId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
