import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, Input, model, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiError, isApiError } from '@core/api/api-errors';
import { apiClient, injectOpenapiQuery } from '@core/api/client';
import { HistoryEntry, ProjectRole, TaskPriority, TaskStatus } from '@core/api/types';
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
import { AssignDialog } from './assign-dialog';
import { TimelineModule } from 'primeng/timeline';
import { AssigneeChipComponent } from '@shared/user-chip/user-chip';
import { Tag } from 'primeng/tag';
@Component({
  standalone: true,
  selector: 'app-task-detail-dialog',
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
    AssignDialog,
    TimelineModule,
    AssigneeChipComponent,
    Tag,
  ],
  template: `
    <app-assign-dialog
      [taskId]="this.taskId()"
      [projectId]="this.projectId"
      [(isOpen)]="this.isAssignDialogOpen"
      (onSuccess)="this.task.refetch()"
    ></app-assign-dialog>

    <p-dialog
      header="{{ this.task.data()?.name }}"
      [modal]="true"
      [(visible)]="this.isOpen"
      [style]="{ width: '80vw', maxWidth: '1200px', height: '90vh' }"
      contentStyleClass="rflex min-h-0 flex-1 basis-1 gap-4 items-start"
    >
      @switch(this.task.status()){ @case("pending"){
      <div class="h-full w-full center">
        <p-progress-spinner ariaLabel="loading" class="size-14" strokeWidth="6" />
      </div>
      } @case("error"){
      <pre>{{ this.task.error() | json }}</pre>
      } @case("success"){

      <div
        class="vflex gap-4 h-full overflow-y-auto flex-initial shrink w-fit max-w-sm min-h-0 animate-fadein animate-duration-500"
      >
        @if(this.errorMessage()){<p-message
          severity="warn"
          icon="pi pi-exclamation-triangle"
          styleClass="mb-2"
          >{{ this.errorMessage() }}</p-message
        >}
        <h2 class="text-xl">Informations</h2>

        <form
          [formGroup]="this.form"
          (ngSubmit)="handleSubmit()"
          class="vflex max-w-sm mx-auto p-4 gap-4"
          novalidate
          dis
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

          <div class="vflex">
            <label class="text-sm" [for]="this.ctrl.completedDate">Date de réalisation</label>

            <p-datepicker
              [formControlName]="this.ctrl.completedDate"
              [invalid]="this.isInvalid('completedDate')"
              size="small"
              fluid
              dateFormat="dd/mm/yy"
              [iconDisplay]="'input'"
              [showIcon]="true"
            />

            @if (this.isInvalid('completedDate')) {
            <p-message severity="error" size="small" variant="simple">Invalide</p-message>
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
      <p-divider layout="vertical" class="h-full animate-fadein animate-duration-500" />
      <div
        class="vflex gap-4 overflow-y-auto min-h-0 basis-0 w-full flex-1 h-full animate-fadein animate-duration-500"
      >
        <div class="vflex gap-4">
          <label class="text-xl" [for]="this.ctrl.dueDate">Assignations</label>

          <div class="rflex gap-2">
            @for (assignation of this.task.data()?.assignations; track assignation.assigneeId) {
            <app-user-chip [username]="assignation.assigneeUsername" />
            }
            <p-button
              size="small"
              styleClass="text-xs p-1 px-2"
              icon="pi pi-plus"
              label="Ajouter"
              [rounded]="true"
              (onClick)="this.isAssignDialogOpen.set(true)"
              [disabled]="!this.auth.checkAllowed(this.currentRole, 'ADMIN', 'MEMBER')"
            />
          </div>
        </div>
        <p-divider />

        <div class="flex-1 overflow-y-auto vflex gap-4">
          <h2 class="text-xl">Historique</h2>

          @if(!this.task.data()?.history?.length){
          <div class="center flex-1">
            <p-message class="m-4" severity="secondary"
              >Aucune modification dans l'historique</p-message
            >
          </div>
          }@else {
          <p-timeline [value]="this.task.data()?.history || []">
            <ng-template #opposite let-entry>
              <div class="rflex w-full justify-between gap-2 relative bottom-1">
                <app-user-chip [username]="asEntry(entry).changedByUsername" />
                <small class="text-surface-500 dark:text-surface-400"
                  >{{ asEntry(entry).changedAt | date : 'shortDate' }}
                  {{ asEntry(entry).changedAt | date : 'shortTime' }}</small
                >
              </div>
            </ng-template>
            <ng-template #content let-entry>
              <div class="rflex w-full gap-2 relative bottom-1">
                <p-tag class="text-xs p-1 text-center" [value]="asEntry(entry).field" />
                <div
                  class="text-md whitespace-nowrap overflow-hidden text-ellipsis w-1/3 line-through "
                >
                  {{ asEntry(entry).oldValue }}
                </div>
                <div><i class="pi pi-arrow-right mr-8"></i></div>
                <div class="text-md whitespace-nowrap overflow-hidden text-ellipsis w-1/3">
                  {{ asEntry(entry).newValue }}
                </div>
              </div>
            </ng-template>
          </p-timeline>
          }
        </div>
      </div>
      } }
    </p-dialog>
  `,
})
export class TaskDetailDialog {
  private messageService = inject(MessageService);
  readonly auth = inject(AuthService);

  @Input({ required: true })
  projectId!: number;

  @Input({ required: true })
  currentRole!: ProjectRole | null;


  taskId = input.required<number | null>();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ State général ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
  protected readonly isAssignDialogOpen = signal(false);

  public readonly task = injectOpenapiQuery.GET('/api/tasks/{taskId}/details', () => ({
    enabled: !!this.taskId(),
    // initialData: {},
    params: { path: { taskId: this.taskId()! } },
  }));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Gestion dialog ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
  public isOpen = model.required<boolean>();

  public onSuccess = output();

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
    completedDate: this.fb.control<Date | null>(null),
    status: this.fb.control<TaskStatus | null>(null, Validators.required),
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

  /* Hydratation du formulaire */
  constructor() {
    effect(() => {
      const data = this.task.data();
      if (!data || this.form.dirty) return;
      this.form.reset({
        name: data.name,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        completedDate: data.completedDate ? new Date(data.completedDate) : null,
        priority: data.priority,
        status: data.status,
      });
      const readonly =!this.auth.checkAllowed(this.currentRole, 'ADMIN', 'MEMBER');
      if (readonly) this.form.disable();
    });

  }

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

      const { data, error } = await apiClient.PUT('/api/tasks/{taskId}', {
        body: {
          name: this.form.value.name!.trim(),
          description: this.form.value.description!.trim(),
          priority: this.form.value.priority!,
          status: this.form.value.status!,
          dueDate: toISODateString(this.form.value.dueDate!),
          completedDate: this.form.value.completedDate
            ? toISODateString(this.form.value.completedDate)
            : undefined,
        },
        params: { path: { taskId: this.taskId()! } },
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
        detail: 'Modifications enregistrées',
        life: 1000,
      });

      this.onSuccess.emit();
      this.task.refetch();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  public asEntry(entry: any): HistoryEntry {
    return entry;
  }
}
