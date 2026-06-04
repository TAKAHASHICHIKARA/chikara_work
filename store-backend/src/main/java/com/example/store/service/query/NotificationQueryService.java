package com.example.store.service.query;

import com.example.store.infrastructure.dto.NotificationDto;
import com.example.store.infrastructure.mapper.NotificationMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationQueryService {

    private final NotificationMapper notificationMapper;

    public NotificationQueryService(NotificationMapper notificationMapper) {
        this.notificationMapper = notificationMapper;
    }

    public List<NotificationDto> getNotifications(String userId) {
        return notificationMapper.findByUserId(userId);
    }

    @Transactional
    public void markAsRead(long notificationId, String userId) {
        notificationMapper.markAsRead(notificationId, userId);
    }

    @Transactional
    public void markAllAsRead(String userId) {
        notificationMapper.markAllAsRead(userId);
    }
}
