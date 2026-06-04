package com.example.store.service.query;

import com.example.store.infrastructure.dto.SystemDto;
import com.example.store.infrastructure.mapper.SystemMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemQueryService {

    private final SystemMapper systemMapper;

    public SystemQueryService(SystemMapper systemMapper) {
        this.systemMapper = systemMapper;
    }

    public List<SystemDto> getSystemsByUser(String userId) {
        return systemMapper.findSystemsByUserId(userId);
    }
}
