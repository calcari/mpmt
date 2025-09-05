import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ApiError } from '@core/api/api-errors';
import { AuthService } from '@core/auth/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading = signal(false);
  authError = signal(false);

  router = inject(Router);
  authService = inject(AuthService);

  model = {
    email: '',
    password: '',
  };

  async onSubmit(f: NgForm) {
    if (f.invalid || this.loading()) return;

    this.authError.set(false);
    this.loading.set(true);

    try {
      // Succès :
      // On set le user dans le auth service
      // Et on redirige vers la home
      const { user, error, status } = await this.authService.login({
        email: this.model.email.trim().toLowerCase(),
        password: this.model.password,
      });

      if (status === 401) {
        this.authError.set(true);
        return;
      }
      
      if (error) {
        throw ApiError.from(error);
      }

      /**
       * Pas besoin de catch !
       * Les erreurs, même asynchrones, sont forwardées au GlobalErrorHandler grace à provideBrowserGlobalErrorListeners()
       */
    } finally {
      this.loading.set(false);
    }
  }
}
