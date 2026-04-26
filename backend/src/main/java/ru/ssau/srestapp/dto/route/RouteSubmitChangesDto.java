package ru.ssau.srestapp.dto.route;

import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
public class RouteSubmitChangesDto {
    private String routeName;
    private String routeDescription;
    private String imageUrl;
    private Integer estimatedDurationMinutes;

    @Valid
    private List<RoutePointRequestDto> points;
}
