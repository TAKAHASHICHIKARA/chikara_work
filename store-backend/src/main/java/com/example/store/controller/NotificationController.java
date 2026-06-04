package com.example.store.controller;

import com.example.store.infrastructure.dto.NotificationDto;
import com.example.store.service.query.NotificationQueryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationQueryService queryService;

    public NotificationController(NotificationQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    public List<NotificationDto> getNotifications(@RequestParam String userId) {
        return queryService.getNotifications(userId);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable long id, @RequestParam String userId) {
        queryService.markAsRead(id, userId);
    }

    @PutMapping("/read-all")
    public void markAllAsRead(@RequestParam String userId) {
        queryService.markAllAsRead(userId);
    }
}
