package ru.ssau.srestapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.ssau.srestapp.dto.route.*;
import ru.ssau.srestapp.exception.EntityNotFoundException;
import ru.ssau.srestapp.service.RouteService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public List<RouteShortDto> getAll() {
        return routeService.getAll();
    }

    @GetMapping("/published")
    public List<RouteShortDto> getPublished() {
        return routeService.getPublished();
    }

    @GetMapping("/{id}")
    public RouteResponseDto getById(@PathVariable Long id) throws EntityNotFoundException {
        return routeService.getById(id);
    }

    @GetMapping("/organizer/{organizerId}")
    public List<RouteShortDto> getByOrganizer(@PathVariable Long organizerId) {
        return routeService.getByOrganizer(organizerId);
    }

    @GetMapping("/search")
    public List<RouteShortDto> search(@RequestParam String keyword) {
        return routeService.search(keyword);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RouteResponseDto create(@Valid @RequestBody RouteRequestDto dto) throws EntityNotFoundException {
        return routeService.create(dto);
    }

    @PutMapping("/{id}/submit")
    public RouteResponseDto submitChanges(
            @PathVariable Long id,
            @Valid @RequestBody RouteSubmitChangesDto dto) throws EntityNotFoundException {
        return routeService.submitChanges(id, dto);
    }

    @GetMapping("/admin/pending")
    public List<RouteShortDto> getPending() {
        return routeService.getPending();
    }

    @PostMapping("/admin/{id}/approve")
    public RouteResponseDto approve(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) throws EntityNotFoundException {
        Long adminId = body.get("adminId");
        return routeService.approve(id, adminId);
    }

    @PostMapping("/admin/{id}/reject")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reject(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) throws EntityNotFoundException {
        String comment = body != null ? body.get("comment") : null;
        routeService.reject(id, comment);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) throws EntityNotFoundException {
        routeService.delete(id);
    }
}
