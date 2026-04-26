import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouteService } from '../../../services/route.service';
import { RouteCard } from '../../../models/route.models';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslateService } from '../../../services/translate.service';

@Component({
  selector: 'app-routes-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './routes-page.component.html',
  styleUrls: ['./routes-page.component.scss']
})
export class RoutesPageComponent implements OnInit {
  routes: RouteCard[] = [];
  filteredRoutes: RouteCard[] = [];
  isLoading = true;
  error: string | null = null;
  searchQuery = '';

  constructor(
    private routeService: RouteService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.routeService.getPublishedRoutes().subscribe({
      next: (routes) => {
        this.routes = routes;
        this.filteredRoutes = routes;
        this.isLoading = false;
      },
      error: () => {
        this.error = this.translate.t('COMMON.ERROR');
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredRoutes = this.routes;
      return;
    }
    this.filteredRoutes = this.routes.filter(r =>
      r.routeName.toLowerCase().includes(q) ||
      (r.routeDescription ?? '').toLowerCase().includes(q)
    );
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} ${this.translate.t('ROUTES.MINUTES')}`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}ч ${m}мин` : `${h}ч`;
  }
}
