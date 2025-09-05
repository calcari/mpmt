import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { LOCALE_ID } from '@angular/core';
import { NoirTheme } from './app/theme';

//Import fr locale (pour les dates en français)
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
registerLocaleData(fr);

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);

getTestBed().configureTestingModule({
  providers: [
    // Config de base (comme l'app)
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideRouter([]),
    provideTanStackQuery(new QueryClient()),
    provideAnimationsAsync(),
    MessageService,
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
      ]
});