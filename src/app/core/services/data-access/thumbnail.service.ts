import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../tokens';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThumbnailService {
  #http = inject(HttpClient);
  #apiBase = inject(API_BASE);

  getThumbnailUrl(id: number): Observable<string> {
    return this.#http
      .get<{ thumbnailUrl: string }>(`${this.#apiBase}/photos/${id}`)
      .pipe(map((response) => response.thumbnailUrl));
  }
}
