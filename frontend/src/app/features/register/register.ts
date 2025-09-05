import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '@core/auth/auth-service';
import { ApiError, isApiError } from '@core/api/api-errors';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);

  loading = signal(false);
  registerError = signal('');
  passwordConfirmMismatch = signal(false);

  model = {
    email: '',
    password: '',
    username: '',
    passwordConfirm: '',
  };

  async handleSubmit(f: NgForm) {
    if (f.invalid || this.loading()) return;

    this.passwordConfirmMismatch.set(false);
    this.registerError.set('');
    this.loading.set(true);

    try {
      const { user, error, status } = await this.authService.register({
        email: this.model.email.trim().toLowerCase(),
        password: this.model.password,
        username: this.model.username.trim(),
      });

      if (error) {
        if (isApiError(error)) {
          switch (error.code) {
            case 'DUPLICATE_EMAIL':
              this.registerError.set('Email déjà utilisé');
              return;
            case 'DUPLICATE_USERNAME':
              this.registerError.set("Nom d'utilisateur déjà utilisé");
              return;
          }
        }
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
