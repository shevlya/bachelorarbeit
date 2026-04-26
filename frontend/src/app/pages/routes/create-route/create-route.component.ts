import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouteService } from '../../../services/route.service';
import { AuthService } from '../../../services/auth.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslateService } from '../../../services/translate.service';

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private routeService: RouteService,
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      routeName: ['', [Validators.required, Validators.maxLength(200)]],
      routeDescription: [''],
      imageUrl: [''],
      estimatedDurationMinutes: [60, [Validators.required, Validators.min(1)]],
      points: this.fb.array([this.createPointGroup()])
    });
  }

  get points(): FormArray {
    return this.form.get('points') as FormArray;
  }

  createPointGroup(): FormGroup {
    return this.fb.group({
      pointName: ['', Validators.required],
      pointDescription: [''],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      sortOrder: [0]
    });
  }

  addPoint(): void {
    const group = this.createPointGroup();
    group.patchValue({ sortOrder: this.points.length });
    this.points.push(group);
  }

  removePoint(index: number): void {
    if (this.points.length > 1) this.points.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.isSubmitting = true;
    this.error = null;

    const points = this.points.value.map((p: any, i: number) => ({ ...p, sortOrder: i }));

    this.routeService.createRoute({
      idOrganizer: currentUser.userId,
      routeName: this.form.value.routeName,
      routeDescription: this.form.value.routeDescription || null,
      imageUrl: this.form.value.imageUrl || null,
      estimatedDurationMinutes: Number(this.form.value.estimatedDurationMinutes),
      points
    }).subscribe({
      next: (r) => {
        this.router.navigate(['/routes/manage']);
      },
      error: () => {
        this.error = this.translate.t('COMMON.ERROR');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/routes']);
  }
}
