import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { API_BASE } from '../../tokens';
import { Observable } from 'rxjs';

type CreateUserParams = {
  firstName: string;
  lastName: string;
  email: string;
  thumbnailUrl: string;
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  #http = inject(HttpClient);
  #apiBase = inject(API_BASE);

  createUser(params: CreateUserParams): Observable<void> {
    return this.#http.post<void>(`${this.#apiBase}/users`, params);
  }
}
