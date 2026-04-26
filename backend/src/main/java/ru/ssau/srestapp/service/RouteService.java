package ru.ssau.srestapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ssau.srestapp.dto.route.*;
import ru.ssau.srestapp.entity.*;
import ru.ssau.srestapp.exception.*;
import ru.ssau.srestapp.repository.RouteRepository;
import ru.ssau.srestapp.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RouteShortDto> getAll() {
        return routeRepository.findAll().stream().map(this::toShortDto).toList();
    }

    @Transactional(readOnly = true)
    public List<RouteShortDto> getPublished() {
        return routeRepository.findPublishedAndVerified().stream().map(this::toShortDto).toList();
    }

    @Transactional(readOnly = true)
    public RouteResponseDto getById(Long id) throws EntityNotFoundException {
        Route route = routeRepository.findByIdWithPoints(id)
                .orElseThrow(() -> new EntityNotFoundException("Route not found with id: " + id));
        return toDto(route);
    }

    @Transactional(readOnly = true)
    public List<RouteShortDto> getByOrganizer(Long organizerId) {
        return routeRepository.findByOrganizer_IdUser(organizerId).stream().map(this::toShortDto).toList();
    }

    @Transactional(readOnly = true)
    public List<RouteShortDto> search(String keyword) {
        return routeRepository.searchByKeyword(keyword).stream().map(this::toShortDto).toList();
    }

    @Transactional(readOnly = true)
    public List<RouteShortDto> getPending() {
        return routeRepository.findByModerationStatus(ModerationStatus.PENDING).stream().map(this::toShortDto).toList();
    }

    @Transactional
    public RouteResponseDto create(RouteRequestDto dto) throws EntityNotFoundException {
        User organizer = findUserOrThrow(dto.getIdOrganizer());
        Route route = new Route();
        route.setOrganizer(organizer);
        route.setRouteName(dto.getRouteName());
        route.setRouteDescription(dto.getRouteDescription());
        route.setImageUrl(dto.getImageUrl());
        route.setEstimatedDurationMinutes(dto.getEstimatedDurationMinutes() != null ? dto.getEstimatedDurationMinutes() : 60);
        route.setModerationStatus(ModerationStatus.PENDING);
        route.setVerified(false);

        if (dto.getPoints() != null) {
            List<RoutePoint> points = buildPoints(dto.getPoints(), route);
            route.setPoints(points);
        }

        return toDto(routeRepository.save(route));
    }

    @Transactional
    public RouteResponseDto submitChanges(Long routeId, RouteSubmitChangesDto dto) throws EntityNotFoundException {
        Route route = findOrThrow(routeId);

        if (dto.getRouteName() != null) route.setRouteName(dto.getRouteName());
        if (dto.getRouteDescription() != null) route.setRouteDescription(dto.getRouteDescription());
        if (dto.getImageUrl() != null) route.setImageUrl(dto.getImageUrl());
        if (dto.getEstimatedDurationMinutes() != null)
            route.setEstimatedDurationMinutes(dto.getEstimatedDurationMinutes());

        if (dto.getPoints() != null) {
            route.getPoints().clear();
            List<RoutePoint> newPoints = buildPoints(dto.getPoints(), route);
            route.getPoints().addAll(newPoints);
        }

        route.setModerationStatus(ModerationStatus.PENDING);
        route.setVerified(false);
        return toDto(routeRepository.save(route));
    }

    @Transactional
    public RouteResponseDto approve(Long routeId, Long adminId) throws EntityNotFoundException {
        Route route = findOrThrow(routeId);
        User admin = findUserOrThrow(adminId);
        route.setAdmin(admin);
        route.setVerified(true);
        route.setModerationStatus(ModerationStatus.PUBLISHED);
        return toDto(routeRepository.save(route));
    }

    @Transactional
    public void reject(Long routeId, String comment) throws EntityNotFoundException {
        Route route = findOrThrow(routeId);
        route.setModerationStatus(ModerationStatus.REJECTED);
        route.setVerified(false);
        if (comment != null) route.setVerificationComment(comment);
        routeRepository.save(route);
    }

    @Transactional
    public void delete(Long routeId) throws EntityNotFoundException {
        Route route = findOrThrow(routeId);
        routeRepository.delete(route);
    }

    // --- helpers ---

    private Route findOrThrow(Long id) throws EntityNotFoundException {
        return routeRepository.findByIdWithPoints(id)
                .orElseThrow(() -> new EntityNotFoundException("Route not found with id: " + id));
    }

    private User findUserOrThrow(Long id) throws EntityNotFoundException {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(EntityType.USER.notFound(id)));
    }

    private List<RoutePoint> buildPoints(List<RoutePointRequestDto> dtoList, Route route) {
        List<RoutePoint> points = new ArrayList<>();
        for (int i = 0; i < dtoList.size(); i++) {
            RoutePointRequestDto p = dtoList.get(i);
            RoutePoint rp = new RoutePoint();
            rp.setRoute(route);
            rp.setPointName(p.getPointName());
            rp.setPointDescription(p.getPointDescription());
            rp.setLatitude(p.getLatitude());
            rp.setLongitude(p.getLongitude());
            rp.setSortOrder(p.getSortOrder() != null ? p.getSortOrder() : i);
            points.add(rp);
        }
        return points;
    }

    private RouteResponseDto toDto(Route route) {
        List<RoutePointResponseDto> points = route.getPoints().stream()
                .map(p -> new RoutePointResponseDto(
                        p.getIdRoutePoint(),
                        p.getPointName(),
                        p.getPointDescription(),
                        p.getLatitude(),
                        p.getLongitude(),
                        p.getSortOrder()
                ))
                .toList();

        return new RouteResponseDto(
                route.getIdRoute(),
                route.getOrganizer().getIdUser(),
                route.getOrganizer().getFio(),
                route.getAdmin() != null ? route.getAdmin().getIdUser() : null,
                route.getAdmin() != null ? route.getAdmin().getFio() : null,
                route.getRouteName(),
                route.getRouteDescription(),
                route.getImageUrl(),
                route.getEstimatedDurationMinutes(),
                route.getModerationStatus().name(),
                route.getVerified(),
                route.getVerificationComment(),
                points
        );
    }

    private RouteShortDto toShortDto(Route route) {
        return new RouteShortDto(
                route.getIdRoute(),
                route.getRouteName(),
                route.getRouteDescription(),
                route.getImageUrl(),
                route.getEstimatedDurationMinutes(),
                route.getOrganizer().getFio(),
                route.getVerified(),
                route.getModerationStatus().name(),
                route.getPoints().size()
        );
    }
}
