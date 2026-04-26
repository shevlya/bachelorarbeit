import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RouteService } from '../../../services/route.service';
import { AuthService } from '../../../services/auth.service';
import { RouteCard } from '../../../models/route.models';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslateService } from '../../../services/translate.service';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage-routes',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, ConfirmationDialogComponent],
  templateUrl: './manage-routes.component.html',
  styleUrls: ['./manage-routes.component.scss']
})
export class ManageRoutesComponent implements OnInit {
  routes: RouteCard[] = [];
  isLoading = true;
  error: string | null = null;
  showDeleteDialog = false;
  routeIdToDelete: number | null = null;
  deleteLoading = false;

  constructor(
    private routeService: RouteService,
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    const user = this.authService.getCurrentUser();
    if (!user) { this.isLoading = false; return; }

    this.routeService.getRoutesByOrganizer(user.userId).subscribe({
      next: (routes) => {
        this.routes = routes;
        this.isLoading = false;
      },
      error: () => {
        this.error = this.translate.t('COMMON.ERROR');
        this.isLoading = false;
      }
    });
  }

  getModerationText(status: string): string {
    return this.translate.t(`ROUTES.MODERATION_${status}`);
  }

  getModerationClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-warning-subtle text-warning border border-warning-subtle';
      case 'PUBLISHED': return 'bg-success-subtle text-success border border-success-subtle';
      case 'REJECTED': return 'bg-danger-subtle text-danger border border-danger-subtle';
      default: return 'bg-light text-dark border';
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} ${this.translate.t('ROUTES.MINUTES')}`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  editRoute(id: number): void {
    this.router.navigate(['/routes/edit', id]);
  }

  openDeleteDialog(id: number): void {
    this.routeIdToDelete = id;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.routeIdToDelete === null) return;
    this.deleteLoading = true;
    this.routeService.deleteRoute(this.routeIdToDelete).subscribe({
      next: () => {
        this.routes = this.routes.filter(r => r.idRoute !== this.routeIdToDelete);
        this.closeDeleteDialog();
        this.deleteLoading = false;
      },
      error: () => {
        this.error = this.translate.t('COMMON.ERROR');
        this.deleteLoading = false;
        this.closeDeleteDialog();
      }
    });
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.routeIdToDelete = null;
  }
}
