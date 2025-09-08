import { Component, inject, input, model, output, Output, resource, signal } from '@angular/core';
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
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { toISODateString } from '@shared/utils/date-utils';
import { ApiError } from '@core/api/api-errors';
@Component({
  standalone: true,
  selector: 'app-new-project-dialog',
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
  ],
  template: `
    <p-dialog
      header="Nouveau projet"
      [modal]="true"
      [(visible)]="this.isOpen"
      [style]="{ width: '25rem' }"
      contentStyleClass="overflow-visible"
    >
      <form
        #formRef="ngForm"
        (ngSubmit)="handleSubmit(formRef)"
        class="max-w-sm mx-auto p-4 space-y-4"
        novalidate
      >
        <div class="space-y-1">
          <label for="projectName">Nom du projet</label>
          <input
            pInputText
            inputId="projectName"
            name="projectName"
            required
            minlength="4"
            maxlength="50"
            class="w-full"
            [(ngModel)]="model.projectName"
            #projectNameRef="ngModel"
          />
          @if (projectNameRef.invalid && (projectNameRef.touched || formRef.submitted)) { @if
          (projectNameRef.errors?.['required']) {
          <p-message severity="error" size="small" variant="simple">Nom requis</p-message>
          } @if (projectNameRef.errors?.['minlength']) {
          <p-message severity="error" size="small" variant="simple">Trop court</p-message>
          } }
        </div>

        <div class="space-y-1">
          <label for="description">Description</label>
          <textarea
            pTextarea
            inputId="description"
            name="description"
            rows="3"
            autoResize
            required
            class="w-full"
            [(ngModel)]="model.description"
            #descriptionRef="ngModel"
          ></textarea>
          @if (descriptionRef.invalid && (descriptionRef.touched || formRef.submitted)) { @if
          (descriptionRef.errors?.['required']) {
          <p-message severity="error" size="small" variant="simple">Description requis</p-message>
          } @if (descriptionRef.errors?.['minlength']) {
          <p-message severity="error" size="small" variant="simple">Trop court</p-message>
          } }
        </div>

        <div class="space-y-1">
          <label for="startDate">Date de début</label>
          <p-datepicker
            class="w-full"
            name="startDate"
            inputId="startDate"
            [(ngModel)]="model.startDate"
            dateFormat="dd/mm/yy"
            [iconDisplay]="'input'"
            [showIcon]="true"
            #startDateRef="ngModel"
            required
            panelStyleClass="scale-75"
          />
          @if (startDateRef.invalid && (startDateRef.touched || formRef.submitted)) {
          <p-message severity="error" size="small" variant="simple">Date requise</p-message>
          }
        </div>

        <div class="space-y-1"></div>

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
export class NewProjectDialog {
  readonly auth = inject(AuthService);
  readonly isSubmitting = signal(false);

  public isOpen = model.required<boolean>();

  public onSuccess = output();

  public model = {
    projectName: '',
    description: '',
    startDate: undefined as Date | undefined,
  };

  protected cancel() {
    this.isOpen.set(false);
  }

  public async handleSubmit(f: NgForm) {
    if (f.invalid || this.isSubmitting()) return;

    try {
      this.isSubmitting.set(true);

      const { data, error } = await apiClient.POST('/api/projects', {
        body: {
          name: this.model.projectName.trim(),
          description: this.model.description.trim(),
          startDate: toISODateString(this.model.startDate!),
        },
      });

      if (error) throw ApiError.from(error);

      this.onSuccess.emit();
      this.isOpen.set(false);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
