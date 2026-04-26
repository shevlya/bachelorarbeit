package ru.ssau.srestapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.ssau.srestapp.entity.ModerationStatus;
import ru.ssau.srestapp.entity.Route;

import java.util.List;
import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Long> {

    @Query("SELECT r FROM Route r LEFT JOIN FETCH r.points WHERE r.idRoute = :id")
    Optional<Route> findByIdWithPoints(@Param("id") Long id);

    List<Route> findByVerifiedTrue();

    @Query("SELECT r FROM Route r WHERE r.verified = true AND r.moderationStatus = 'PUBLISHED'")
    List<Route> findPublishedAndVerified();

    List<Route> findByOrganizer_IdUser(Long organizerId);

    List<Route> findByModerationStatus(ModerationStatus status);

    @Query("SELECT r FROM Route r WHERE LOWER(r.routeName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(r.routeDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Route> searchByKeyword(@Param("keyword") String keyword);
}
