import { CommonModule } from '@angular/common';
import { Component, inject, Input, model, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiError, isApiError } from '@core/api/api-errors';
import { apiClient } from '@core/api/client';
import { TaskPriority, TaskStatus } from '@core/api/types';
import { AuthService } from '@core/auth/auth-service';
import { toISODateString } from '@shared/utils/date-utils';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TimelineModule } from 'primeng/timeline';
@Component({
  standalone: true,
  selector: 'app-new-task-dialog',
  imports: [
    CommonModule,
    DialogModule,
    ProgressSpinnerModule,
    ButtonModule,
    RouterModule,
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
    DatePickerModule,
    SelectModule,
    ChipModule,
    DividerModule,
    TimelineModule,
  ],
  template: `
    <p-dialog
      header="Nouvelle tâche"
      [modal]="true"
      [(visible)]="this.isOpen"
      [style]="{ maxWidth: '1200px', height: '90vh' }"
      contentStyleClass="rflex min-h-0 flex-1 basis-1 gap-4 items-start"
    >
      <div
        class="vflex gap-4 h-full overflow-y-auto flex-initial shrink w-fit max-w-sm min-h-0 animate-fadein animate-duration-500"
      >
        @if(this.errorMessage()){<p-message
          severity="warn"
          icon="pi pi-exclamation-triangle"
          styleClass="mb-2"
          >{{ this.errorMessage() }}</p-message
        >}

        <form
          [formGroup]="this.form"
          (ngSubmit)="handleSubmit()"
          class="vflex max-w-sm mx-auto p-4 gap-4"
          novalidate
        >
          <div class="vflex">
            <label class="text-sm" [for]="this.ctrl.name">Titre</label>

            <input
              pInputText
              [formControlName]="this.ctrl.name"
              [invalid]="this.isInvalid('name')"
              pSize="small"
              fluid
            />
            @if (this.isErrorVisible('name', 'required')) {
            <p-message severity="error" size="small" variant="simple">Titre requis.</p-message>
            }
          </div>

          <div class="vflex">
            <label class="text-sm" [for]="this.ctrl.description">Description</label>

            <textarea
              [formControlName]="this.ctrl.description"
              [invalid]="this.isInvalid('description')"
              pTextarea
              rows="3"
              autoResize
              pSize="small"
              fluid
            ></textarea>
            @if (this.isErrorVisible('description', 'required')) {
            <p-message severity="error" size="small" variant="simple"
              >Description requis.</p-message
            >
            }
          </div>

          <div class="vflex">
            <label class="text-sm" [for]="this.ctrl.priority">Priorité</label>

            <p-select
              [formControlName]="this.ctrl.priority"
              [options]="this.priorities"
              [invalid]="this.isInvalid('priority')"
              optionLabel="label"
              optionValue="value"
              placeholder="Choisir une priorité"
              size="small"
              fluid
            />
            @if (this.isErrorVisible('priority', 'required')) {
            <p-message severity="error" size="small" variant="simple">Priorité requis.</p-message>
            }
          </div>

          <div class="vflex">
            <label class="text-sm" [for]="this.ctrl.status">Statut</label>

            <p-select
              [formControlName]="this.ctrl.status"
              [options]="this.statuses"
              [invalid]="this.isInvalid('status')"
              optionLabel="label"
              optionValue="value"
              placeholder="Choisir un Statut"
              size="small"
              fluid
            />
            @if (this.isErrorVisible('status', 'required')) {
            <p-message severity="error" size="small" variant="simple">Statut requis.</p-message>
            }
          </div>

          <div class="vflex">
            <label class="text-sm" [for]="this.ctrl.dueDate">Date d'écheance</label>

            <p-datepicker
              [formControlName]="this.ctrl.dueDate"
              [invalid]="this.isInvalid('dueDate')"
              size="small"
              fluid
              dateFormat="dd/mm/yy"
              [iconDisplay]="'input'"
              [showIcon]="true"
            />

            @if (this.isInvalid('dueDate')) {
            <p-message severity="error" size="small" variant="simple">Echeance requis.</p-message>
            }
          </div>

          <div class="flex justify-end gap-2">
            <p-button label="Annuler" severity="secondary" (click)="this.cancel()" />
            <p-button
              type="submit"
              label="Valider"
              [loading]="this.isSubmitting()"
              [disabled]="!this.form.valid || this.isSubmitting()"
            ></p-button>
          </div>
        </form>
      </div>
    </p-dialog>
  `,
})
export class NewTaskDialog {
  private messageService = inject(MessageService);
  readonly auth = inject(AuthService);

  @Input({ required: true })
  projectId!: number;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Gestion dialog ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
  public isOpen = model.required<boolean>();

  public onSuccess = output<number>();

  protected cancel() {
    this.isOpen.set(false);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━ Configuration du formulaire ━━━━━━━━━━━━━━━━━━━━━━━━━━ //

  /* State du formulaire */
  protected readonly isSubmitting = signal(false);
  protected readonly isSubmitted = signal(false);
  protected readonly errorMessage = signal('');

  private fb = inject(FormBuilder);

  /** Définition des champs */
  public readonly form = this.fb.group({
    name: this.fb.control('', Validators.required),
    description: this.fb.control('', Validators.required),
    dueDate: this.fb.control<Date | null>(null, Validators.required),
    status: this.fb.control<TaskStatus | null>('TODO', Validators.required),
    priority: this.fb.control<TaskPriority | null>(null, Validators.required),
  });

  readonly ctrl = Object.fromEntries(
    Object.keys(this.form.controls).map((name) => [name, name])
  ) as Record<keyof (typeof this)['form']['controls'], string>;

  /** Liste d'options pour le champ "priority" */
  protected readonly priorities = Object.entries({
    URGENT: 'Urgent',
    HIGH: 'Haute',
    MEDIUM: 'Modérée',
    LOW: 'Basse',
  } satisfies Record<TaskPriority, string>).map(([value, label]) => ({ value, label }));

  /** Liste d'options pour le champ "status" */
  protected readonly statuses = Object.entries({
    BLOCKED: 'Bloqué',
    DONE: 'Fait',
    DOING: 'En cours',
    TODO: 'A traiter',
  } satisfies Record<TaskStatus, string>).map(([value, label]) => ({ value, label }));

  /* Form helpers */
  isErrorVisible(controlName: keyof typeof this.ctrl, validator: string) {
    const control = this.form.get(controlName as string);
    return (
      control?.invalid && control?.errors?.[validator] && (control.touched || this.isSubmitted())
    );
  }

  isInvalid(controlName: keyof typeof this.ctrl) {
    const control = this.form.get(controlName as string);
    return control?.invalid && (control.touched || this.isSubmitted());
  }

  /* Submit */
  public async handleSubmit() {
    this.isSubmitted.set(true);

    if (this.form.invalid || this.isSubmitting()) return;
    this.errorMessage.set('');

    try {
      this.isSubmitting.set(true);

      const { data, error } = await apiClient.POST('/api/tasks/project/{projectId}', {
        params: { path: { projectId: this.projectId! } },
        body: {
          name: this.form.value.name!.trim(),
          description: this.form.value.description!.trim(),
          priority: this.form.value.priority!,
          status: this.form.value.status!,
          dueDate: toISODateString(this.form.value.dueDate!),
        },
      });

      if (error) {
        if (isApiError(error)) {
          switch (error.code) {
            case 'MISSING_RIGHTS':
              this.errorMessage.set('Vous ne disposez pas des autorisations nécessaires');
              return;
          }
        }
        throw ApiError.from(error);
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Tâche crée',
        life: 3000,
      });

      this.onSuccess.emit(data.id!);
      this.isOpen.set(false);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
