package com.example.store.controller;

import com.example.store.infrastructure.dto.DailySalesSummaryDto;
import com.example.store.service.query.DailySalesQueryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class DailySalesController {

    private final DailySalesQueryService queryService;

    public DailySalesController(DailySalesQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping("/daily-summary")
    public List<DailySalesSummaryDto> getDailySummary(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(defaultValue = "dateDesc") String sort
    ) {
        return queryService.getSalesSummary(startDate, endDate, sort);
    }
}
