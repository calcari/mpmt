import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { injectOpenapiQuery } from '@core/api/client';
import { AuthService } from '@core/auth/auth-service';
import { RoleTag } from '@shared/role-tag/role-tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NewProjectDialog } from './new-project-dialog';

@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    RouterModule,
    CardModule,
    RoleTag,
    NewProjectDialog,
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList {
  auth = inject(AuthService);

  projects = injectOpenapiQuery.GET('/api/projects/me', () => ({
    // initialData: [],
    enabled: !!this.auth.userId,
  }));

  protected isNewProjectDialogOpen = signal(false);

  showNewProjectDialog() {
    this.isNewProjectDialogOpen.set(true);
  }
}
