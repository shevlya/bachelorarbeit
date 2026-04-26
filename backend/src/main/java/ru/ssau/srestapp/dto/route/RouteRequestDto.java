package ru.ssau.srestapp.dto.route;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RouteRequestDto {

    @NotNull(message = "Organizer ID is required")
    private Long idOrganizer;

    @NotBlank(message = "Route name is required")
    private String routeName;

    private String routeDescription;

    private String imageUrl;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer estimatedDurationMinutes = 60;

    @Valid
    private List<RoutePointRequestDto> points = new ArrayList<>();
}
