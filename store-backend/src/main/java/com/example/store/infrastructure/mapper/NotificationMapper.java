package com.example.store.infrastructure.mapper;

import com.example.store.infrastructure.dto.NotificationDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NotificationMapper {
    List<NotificationDto> findByUserId(@Param("userId") String userId);
    int markAsRead(@Param("notificationId") long notificationId, @Param("userId") String userId);
    int markAllAsRead(@Param("userId") String userId);
}
