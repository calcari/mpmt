import {
  ApplicationConfig,
  ErrorHandler,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTanStackQuery, QueryClient, withDevtools } from '@tanstack/angular-query-experimental';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import fr from '@angular/common/locales/fr';
import { GlobalErrorHandler } from '@core/errors/global-error-handler';
import { routes } from './app.routes';
import { NoirTheme } from './theme';

//Import fr locale (pour les dates en français)
import { registerLocaleData } from '@angular/common';
registerLocaleData(fr);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideTanStackQuery(new QueryClient(), withDevtools()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: NoirTheme,
        options: {
          darkModeSelector: '.azerty-no-darkmode',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
