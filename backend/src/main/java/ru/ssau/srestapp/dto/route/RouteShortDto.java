package ru.ssau.srestapp.dto.route;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouteShortDto {
    private Long idRoute;
    private String routeName;
    private String routeDescription;
    private String imageUrl;
    private Integer estimatedDurationMinutes;
    private String organizerFio;
    private Boolean verified;
    private String moderationStatus;
    private Integer pointCount;
}
