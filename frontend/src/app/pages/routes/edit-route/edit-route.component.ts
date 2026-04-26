import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouteService } from '../../../services/route.service';
import { RouteDetail } from '../../../models/route.models';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslateService } from '../../../services/translate.service';

@Component({
  selector: 'app-edit-route',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  form!: FormGroup;
  isLoading = true;
  isSubmitting = false;
  error: string | null = null;
  routeId!: number;
  route!: RouteDetail;

  constructor(
    private fb: FormBuilder,
    private routeService: RouteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.routeId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.buildForm();
    this.loadRoute();
  }

  buildForm(): void {
    this.form = this.fb.group({
      routeName: ['', [Validators.required, Validators.maxLength(200)]],
      routeDescription: [''],
      imageUrl: [''],
      estimatedDurationMinutes: [60, [Validators.required, Validators.min(1)]],
      points: this.fb.array([])
    });
  }

  loadRoute(): void {
    this.routeService.getRouteById(this.routeId).subscribe({
      next: (r) => {
        this.route = r;
        this.form.patchValue({
          routeName: r.routeName,
          routeDescription: r.routeDescription || '',
          imageUrl: r.imageUrl || '',
          estimatedDurationMinutes: r.estimatedDurationMinutes
        });
        r.points.forEach(p => this.points.push(this.fb.group({
          pointName: [p.pointName, Validators.required],
          pointDescription: [p.pointDescription || ''],
          latitude: [p.latitude, [Validators.required, Validators.min(-90), Validators.max(90)]],
          longitude: [p.longitude, [Validators.required, Validators.min(-180), Validators.max(180)]],
          sortOrder: [p.sortOrder]
        })));
        if (this.points.length === 0) this.addPoint();
        this.isLoading = false;
      },
      error: () => {
        this.error = this.translate.t('COMMON.ERROR');
        this.isLoading = false;
      }
    });
  }

  get points(): FormArray {
    return this.form.get('points') as FormArray;
  }

  addPoint(): void {
    this.points.push(this.fb.group({
      pointName: ['', Validators.required],
      pointDescription: [''],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      sortOrder: [this.points.length]
    }));
  }

  removePoint(index: number): void {
    if (this.points.length > 1) this.points.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.error = null;

    const points = this.points.value.map((p: any, i: number) => ({ ...p, sortOrder: i }));

    this.routeService.submitChanges(this.routeId, {
      routeName: this.form.value.routeName,
      routeDescription: this.form.value.routeDescription || null,
      imageUrl: this.form.value.imageUrl || null,
      estimatedDurationMinutes: Number(this.form.value.estimatedDurationMinutes),
      points
    }).subscribe({
      next: () => {
        this.router.navigate(['/routes/manage']);
      },
      error: () => {
        this.error = this.translate.t('COMMON.ERROR');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/routes/manage']);
  }
}
