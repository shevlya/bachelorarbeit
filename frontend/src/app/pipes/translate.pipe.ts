import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '../services/translate.service';

@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform, OnDestroy {
  private sub: Subscription;
  private lastKey = '';
  private lastValue = '';

  constructor(private translate: TranslateService, private cd: ChangeDetectorRef) {
    this.sub = this.translate.currentLang$.subscribe(() => {
      this.lastKey = '';
      this.cd.markForCheck();
    });
  }

  transform(key: string, params?: Record<string, string | number>): string {
    if (!key) return '';
    const result = this.translate.t(key, params);
    if (result !== this.lastValue || key !== this.lastKey) {
      this.lastKey = key;
      this.lastValue = result;
    }
    return this.lastValue;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
