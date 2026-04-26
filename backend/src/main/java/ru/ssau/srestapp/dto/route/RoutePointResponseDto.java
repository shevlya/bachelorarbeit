package ru.ssau.srestapp.dto.route;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoutePointResponseDto {
    private Long idRoutePoint;
    private String pointName;
    private String pointDescription;
    private Double latitude;
    private Double longitude;
    private Integer sortOrder;
}
