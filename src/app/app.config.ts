import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { API_BASE } from './core/tokens';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Injection tokens
    {
      provide: API_BASE,
      useValue: 'https://jsonplaceholder.typicode.com',
    },
  ],
};
