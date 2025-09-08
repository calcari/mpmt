import {
  Component,
  inject,
  Input,
  input,
  model,
  output,
  Output,
  resource,
  signal,
} from '@angular/core';
import { apiClient, injectOpenapiQuery } from '@core/api/client';
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
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { isApiError } from '@core/api/api-errors';
import { ListboxModule } from 'primeng/listbox';
import { components } from '@core/api/schema';

@Component({
  standalone: true,
  selector: 'app-assign-dialog',
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
    ListboxModule,
    RoleTag,
  ],
  template: `
    <p-dialog
      header="Assigner une tache"
      [modal]="true"
      [(visible)]="this.isOpen"
      contentStyleClass="overflow-visible"
    >
      @if(this.errorMessage()){<p-message
        severity="warn"
        icon="pi pi-exclamation-triangle"
        styleClass="mb-2"
        >{{ this.errorMessage() }}</p-message
      >} @switch (this.members.status()) { @case ("pending") {
      <p-progress-spinner arisaLabel="loading" />
      } @case ("error") {
      <pre>{{ this.members.error() | json }}</pre>
      } @case("success"){
      <div class="flex flex-col gap-4">
        <p-listbox
          (onClick)="this.handleSelect($event.value)"
          (ngModelChange)="($event)"
          [options]="this.members.data()!"
          optionLabel="name"
          optionValue="userId"
          [optionDisabled]="this.isAlreadyAssigned"
          class="w-full md:w-56"
          name="member"
          required
        >
          <ng-template #item let-membership>
            <div class="flex items-center gap-2 justify-between w-full">
              <div class="capitalize">{{ membership.username }}</div>
              <app-role-tag class="text-xs" [role]="membership.role" />
            </div>
          </ng-template>
        </p-listbox>
        <div class="flex justify-end gap-2">
          <p-button label="Annuler" severity="secondary" (click)="this.cancel()" />
        </div>
      </div>

      } }
    </p-dialog>
  `,
})
export class AssignDialog {
  private messageService = inject(MessageService);
  readonly auth = inject(AuthService);

  @Input({ required: true })
  projectId!: number;

  taskId = input.required<number | null>();

  public isOpen = model.required<boolean>();
  public isSubmitting = signal(false);

  protected readonly errorMessage = signal('');

  public onSuccess = output();

  public members = injectOpenapiQuery.GET('/api/projects/{projectId}/members', () => ({
    params: { path: { projectId: this.projectId! } },
    // initialData: [],
    enabled: !!this.projectId,
  }));

  public task = injectOpenapiQuery.GET('/api/tasks/{taskId}/details', () => ({
    params: { path: { taskId: this.taskId()! } },
    enabled: !!this.taskId(),
  }));

  protected cancel() {
    this.isOpen.set(false);
  }

  public async handleSelect(userId: number | null) {
    if (!userId) return;
    this.errorMessage.set('');

    try {
      this.isSubmitting.set(true);

      const { data, error } = await apiClient.POST('/api/tasks/{taskId}/assign', {
        params: { path: { taskId: this.taskId()! }, query: { assigneeId: userId } },
      });

      if (error) {
        if (isApiError(error)) {
          switch (error.code) {
            case 'MISSING_RIGHTS':
              this.errorMessage.set('Vous ne disposez pas des autorisations nécessaires');
              return;

            case 'ASSIGNEE_ALREADY_ASSIGNED':
              this.errorMessage.set('La personne ciblée est déjà assigné à cette tâche');
              return;

            case 'ASSIGNEE_NOT_MEMBER':
              this.errorMessage.set('La personne ciblée ne fait pas parti du projet');
              return;
          }
        }
        throw ApiError.from(error);
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Utilisateur assigné',
        detail: 'Il a été notifié par email.',
        life: 3000,
      });

      this.onSuccess.emit();
      this.isOpen.set(false);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  readonly isAlreadyAssigned = (
    option: components['schemas']['ProjectMembershipCoreDTO']
  ): boolean => {
    const assigned = !!this.task
      ?.data()
      ?.assignations?.some((assignation) => assignation.assigneeId === option.userId);
    console.log('isAlreadyAssigned', assigned, {
      option,
      assigned,
      data: this.task?.data(),
      this: this,
    });

    return assigned;
  };
}
