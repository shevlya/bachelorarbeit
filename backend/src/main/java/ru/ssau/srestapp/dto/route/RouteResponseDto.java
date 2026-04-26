package ru.ssau.srestapp.dto.route;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RouteResponseDto {
    private Long idRoute;
    private Long idOrganizer;
    private String organizerFio;
    private Long idAdmin;
    private String adminFio;
    private String routeName;
    private String routeDescription;
    private String imageUrl;
    private Integer estimatedDurationMinutes;
    private String moderationStatus;
    private Boolean verified;
    private String verificationComment;
    private List<RoutePointResponseDto> points;
}
