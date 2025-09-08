import { ErrorHandler, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  router = inject(Router);

  handleError(err: unknown): void {
    console.error(err);
    if (this.router.url.startsWith('/error')) return;

    this.router.navigate(['/error'], {
      queryParams: {
        status: !!err && typeof err === 'object' && 'status' in err ? err.status : undefined,
        message:
          !!err && typeof err === 'object' && 'message' in err ? err.message : 'Erreur inconnue',
      },
    });
  }
}
