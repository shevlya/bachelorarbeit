import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ConfigService {
  private privacyVersion: string = 'v1.0';

  constructor(private http: HttpClient) {
  }

  async loadPrivacyVersion(): Promise<void> {
    try {
      const version = await firstValueFrom(
        this.http.get('/api/public/privacy-version', {responseType: 'text'})
      );
      this.privacyVersion = version;
    } catch (e) {
      console.warn('Не удалось загрузить версию политики');
    }
  }

  getPrivacyVersion(): string {
    return this.privacyVersion;
  }
}
