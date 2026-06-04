package com.example.store.controller;

import com.example.store.infrastructure.dto.SystemDto;
import com.example.store.service.query.SystemQueryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/systems")
@CrossOrigin(origins = "http://localhost:5173")
public class SystemController {

    private final SystemQueryService queryService;

    public SystemController(SystemQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    public List<SystemDto> getSystems(@RequestParam String userId) {
        return queryService.getSystemsByUser(userId);
    }
}
