import { Component, inject, Input, input, model, output, Output, resource, signal } from '@angular/core';
import { apiClient } from '@core/api/client';
import { HttpClient } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { RoleTag } from '@shared/role-tag/role-tag';
import { AuthService } from '@core/auth/auth-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiError } from '@core/api/api-errors';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { toISODateString } from '@shared/utils/date-utils';
import { stringEnum } from '@shared/utils/string-enum';
import { ProjectRole } from '@core/api/types';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { isApiError } from '@core/api/api-errors';

@Component({
  standalone: true,
  selector: 'app-invite-dialog',
  imports: [
    CommonModule,
    DialogModule,
    ProgressSpinnerModule,
    ButtonModule,
    RouterModule,
    CardModule,
    FormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
    DatePickerModule,
    SelectModule,
  ],
  template: `
    <p-dialog
      header="Invitation à rejoindre le projet"
      [modal]="true"
      [(visible)]="this.isOpen"
      [style]="{ width: '25rem' }"
      contentStyleClass="overflow-visible"
    >
      @if(this.errorMessage()){<p-message
        severity="warn"
        icon="pi pi-exclamation-triangle"
        styleClass="mb-2"
        >{{ this.errorMessage() }}</p-message
      >}
      <form
        #formRef="ngForm"
        (ngSubmit)="handleSubmit(formRef)"
        class="max-w-sm mx-auto p-4 space-y-4"
        novalidate
      >
        <div class="space-y-1">
          <label for="email">Adresse email</label>
          <input
            pInputText
            inputId="email"
            name="email"
            type="text"
            required
            class="w-full"
            [(ngModel)]="model.email"
            #emailRef="ngModel"
          />
          @if (emailRef.invalid && (emailRef.touched || formRef.submitted)) { @if
          (emailRef.errors?.['required']) {
          <p-message severity="error" size="small" variant="simple">Email requis</p-message>
          } @if (emailRef.errors?.['email']) {
          <p-message severity="error" size="small" variant="simple">Email invalide</p-message>
          } }
        </div>

        <div class="vflex">
          <label for="role">Rôle</label>

          <p-select
            name="role"
            #roleRef="ngModel"
            [(ngModel)]="model.role"
            [options]="this.roles"
            [invalid]="roleRef.invalid && (roleRef.touched || formRef.submitted)"
            optionLabel="label"
            optionValue="value"
            placeholder="Choisir un rôle"
            class="w-full"
            required
          />
          @if (roleRef.invalid && (roleRef.touched || formRef.submitted)) {
          <p-message severity="error" size="small" variant="simple">Role is required.</p-message>
          }
        </div>

        <div class="flex justify-end gap-2">
          <p-button label="Annuler" severity="secondary" (click)="this.cancel()" />
          <p-button
            type="submit"
            label="Valider"
            [loading]="this.isSubmitting()"
            [disabled]="formRef.invalid"
          ></p-button>
        </div>
      </form>
    </p-dialog>
  `,
})
export class InviteDialog {
  private messageService = inject(MessageService);
  readonly auth = inject(AuthService);

  @Input({ required: true })
  projectId!: number

  protected readonly isSubmitting = signal(false);

  public isOpen = model.required<boolean>();

  protected readonly errorMessage = signal('');

  public onSuccess = output();

  public model = {
    email: '',
    role: '',
  };

  public roles = Object.entries({
    ADMIN: 'Admin',
    MEMBER: 'Membre',
    VIEWER: 'Observateur',
  } satisfies Record<ProjectRole, string>).map(([value, label]) => ({ value, label }));

  protected cancel() {
    this.isOpen.set(false);
  }

  public async handleSubmit(f: NgForm) {
    if (f.invalid || this.isSubmitting()) return;
    this.errorMessage.set('');

    try {
      this.isSubmitting.set(true);

      const { data, error } = await apiClient.POST('/api/projects/{projectId}/members', {
        body: {
          inviterId: this.auth.userId!,
          projectId: this.projectId,

          // projectId://TODO;
          userEmail: this.model.email.trim().toLowerCase(),
          role: this.model.role as ProjectRole,
        },
        params: { path: { projectId: this.projectId } },
      });

      if (error) {
        if (isApiError(error)) {
          switch (error.code) {
            case 'MISSING_RIGHTS':
              this.errorMessage.set('Vous ne disposez pas des autorisations nécessaires');
              return;

            case 'INVITEE_ALREADY_MEMBER':
              this.errorMessage.set('Cet utilisateur est déjà membre du projet');
              return;

            case 'INVITEE_NOT_FOUND':
              this.errorMessage.set('Utilisateur introuvable');
              return;
          }
        }
        throw ApiError.from(error);
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Invitation envoyée',
        life: 3000,
      });

      this.onSuccess.emit();
      this.isOpen.set(false);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}