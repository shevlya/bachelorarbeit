package ru.ssau.srestapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "route_point")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoutePoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRoutePoint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_route", nullable = false)
    private Route route;

    @Column(nullable = false)
    private Integer sortOrder = 0;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String pointName;

    @Column(columnDefinition = "TEXT")
    private String pointDescription;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;
}
