import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

export type SupportedLang = 'ru' | 'en';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private translations: Record<string, any> = {};
  private lang$ = new BehaviorSubject<SupportedLang>(this.getSavedLang());

  readonly currentLang$ = this.lang$.asObservable();

  constructor(private http: HttpClient) {}

  private getSavedLang(): SupportedLang {
    const saved = localStorage.getItem('app_lang') as SupportedLang;
    return saved === 'en' ? 'en' : 'ru';
  }

  get currentLang(): SupportedLang {
    return this.lang$.getValue();
  }

  async loadTranslations(lang: SupportedLang): Promise<void> {
    const data = await firstValueFrom(
      this.http.get<Record<string, any>>(`assets/i18n/${lang}.json`)
    );
    this.translations = data;
    this.lang$.next(lang);
    localStorage.setItem('app_lang', lang);
  }

  async switchLang(lang: SupportedLang): Promise<void> {
    await this.loadTranslations(lang);
  }

  t(key: string, params?: Record<string, string | number>): string {
    const parts = key.split('.');
    let value: any = this.translations;
    for (const part of parts) {
      if (value == null) return key;
      value = value[part];
    }
    if (typeof value !== 'string') return key;
    if (params) {
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{{${k}}}`, String(v)),
        value
      );
    }
    return value;
  }
}
