import {APP_INITIALIZER, ApplicationConfig, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {routes} from './app.routes';
import {authInterceptor} from './interceptor/auth-interceptor';
import {AuthService} from './services/auth.service';
import {ConfigService} from './services/config.service';
import {TranslateService} from './services/translate.service';

registerLocaleData(localeRu);

function initializeAuth(authService: AuthService): () => void {
  return () => authService.initialize();
}

function initializePrivacyVersion(configService: ConfigService): () => Promise<void> {
  return () => configService.loadPrivacyVersion();
}

function initializeTranslations(translateService: TranslateService): () => Promise<void> {
  return () => translateService.loadTranslations(translateService.currentLang);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializePrivacyVersion,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslations,
      deps: [TranslateService],
      multi: true
    },
    {provide: LOCALE_ID, useValue: 'ru-RU'}
  ]
};
