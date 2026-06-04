package com.example.store.service.query;

import com.example.store.infrastructure.dto.DailySalesSummaryDto;
import com.example.store.infrastructure.mapper.DailySalesMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DailySalesQueryService {

    private final DailySalesMapper dailySalesMapper;

    public DailySalesQueryService(DailySalesMapper dailySalesMapper) {
        this.dailySalesMapper = dailySalesMapper;
    }

    public List<DailySalesSummaryDto> getSalesSummary(LocalDate startDate, LocalDate endDate, String sort) {
        return dailySalesMapper.findSalesSummary(startDate, endDate, sort);
    }
}
