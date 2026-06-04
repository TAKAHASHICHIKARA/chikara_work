package com.example.store.infrastructure.mapper;

import com.example.store.infrastructure.dto.BranchSummaryDto;
import com.example.store.infrastructure.dto.DailySalesSummaryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface DailySalesMapper {
    List<DailySalesSummaryDto> findSalesSummary(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("sort") String sort
    );

    List<BranchSummaryDto> findBranchSummary(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
