package ru.ssau.srestapp.dto.route;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoutePointRequestDto {

    @NotBlank(message = "Point name is required")
    private String pointName;

    private String pointDescription;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Integer sortOrder = 0;
}
