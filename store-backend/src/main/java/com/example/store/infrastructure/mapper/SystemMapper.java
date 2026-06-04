package com.example.store.infrastructure.mapper;

import com.example.store.infrastructure.dto.SystemDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SystemMapper {
    List<SystemDto> findSystemsByUserId(@Param("userId") String userId);
}
