import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, ActivatedRoute, Router} from '@angular/router';
import {RouteService} from '../../../services/route.service';
import {RouteDetail} from '../../../models/route.models';
import {TranslatePipe} from '../../../pipes/translate.pipe';
import {TranslateService} from '../../../services/translate.service';

declare const maplibregl: any;

@Component({
  selector: 'app-route-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './route-detail-page.component.html',
  styleUrls: ['./route-detail-page.component.scss']
})
export class RouteDetailPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  route: RouteDetail | null = null;
  isLoading = true;
  error: string | null = null;

  private map: any = null;
  private markers: any[] = [];

  /** 👉 индекс открытой точки */
  activePointIndex: number | null = null;

  constructor(
    private routeService: RouteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.routeService.getRouteById(id).subscribe({
      next: (r) => {
        this.route = r;
        this.isLoading = false;
        setTimeout(() => this.initMap(), 100);
      },
      error: () => {
        this.error = this.translate.t('COMMON.ERROR');
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.route) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  /**
   * 🔥 КЛИК ПО ТОЧКЕ (главная логика)
   */
  togglePoint(index: number): void {
    if (this.activePointIndex === index) {
      this.activePointIndex = null;
      return;
    }

    this.activePointIndex = index;

    const point = this.route?.points[index];
    if (!point || !this.map) return;

    // 👉 центрируем карту
    this.map.flyTo({
      center: [point.longitude, point.latitude],
      zoom: 15
    });

    // 👉 открываем popup маркера
    const marker = this.markers[index];
    if (marker) {
      marker.togglePopup();
    }
  }

  /**
   * MAP INIT
   */
  private initMap(): void {
    if (!this.route || !this.mapContainer?.nativeElement) return;
    if (this.map) return;

    const points = this.route.points;
    if (points.length === 0) return;

    const center = [points[0].longitude, points[0].latitude];

    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center,
      zoom: 13
    });

    this.map.on('load', () => {
      const coordinates = points.map(p => [p.longitude, p.latitude]);

      // линия маршрута
      this.map.addSource('route-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {type: 'LineString', coordinates}
        }
      });

      this.map.addLayer({
        id: 'route-line-layer',
        type: 'line',
        source: 'route-line',
        paint: {
          'line-color': '#9c89ff',
          'line-width': 3,
          'line-dasharray': [2, 1]
        }
      });

      // маркеры
      points.forEach((point, index) => {
        const el = document.createElement('div');
        el.className = 'map-marker';
        el.innerHTML = `<span>${index + 1}</span>`;

        const popup = new maplibregl.Popup({offset: 25}).setHTML(
          `<div class="map-popup">
            <strong>${point.pointName}</strong>
            ${point.pointDescription ? `<p>${point.pointDescription}</p>` : ''}
          </div>`
        );

        const marker = new maplibregl.Marker({element: el})
          .setLngLat([point.longitude, point.latitude])
          .setPopup(popup)
          .addTo(this.map);

        this.markers.push(marker);
      });

      // bounds
      if (points.length > 1) {
        const bounds = points.reduce(
          (b, p) => b.extend([p.longitude, p.latitude]),
          new maplibregl.LngLatBounds(
            [points[0].longitude, points[0].latitude],
            [points[0].longitude, points[0].latitude]
          )
        );
        this.map.fitBounds(bounds, {padding: 50});
      }
    });
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} ${this.translate.t('ROUTES.MINUTES')}`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  goBack(): void {
    this.router.navigate(['/routes']);
  }
}
