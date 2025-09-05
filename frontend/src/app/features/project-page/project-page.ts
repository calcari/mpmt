import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { injectOpenapiQuery } from '@core/api/client';
import { AuthService } from '@core/auth/auth-service';
import { RoleTag } from '@shared/role-tag/role-tag';
import { AssigneeChipComponent } from "@shared/user-chip/user-chip";
import { MessageService } from 'primeng/api';
import { ButtonModule } from "primeng/button";
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from "primeng/tag";
import { InviteDialog } from "./invite-dialog";
import { NewTaskDialog } from './new-task-dialog';
import { TaskCard } from './task-card';
import { TaskDetailDialog } from "./task-detail-dialog";

@Component({
  selector: 'app-project-page',
  imports: [
    CommonModule,
    RoleTag,
    ProgressSpinnerModule,
    DividerModule,
    ButtonModule,
    InviteDialog,
    TaskDetailDialog,
    AssigneeChipComponent,
    TaskCard,
    NewTaskDialog,
    TagModule,
],
  templateUrl: './project-page.html',
  styleUrl: './project-page.css',
})
export class ProjectPage {
  private route = inject(ActivatedRoute);
  readonly auth = inject(AuthService);

  public isCurrentUser(userId: number | null | undefined) {
    if (userId === null || userId === undefined) return false;
    return userId === this.auth.user?.id;
  }

  public projectId = Number(this.route.snapshot.paramMap.get('projectId'));

  public project = injectOpenapiQuery.GET('/api/projects/{projectId}', () => ({
    // initialData:{},
    enabled: !!this.projectId,
    params: { path: { projectId: this.projectId } },
  }));

  public projectMembers = injectOpenapiQuery.GET('/api/projects/{projectId}/members', () => ({
    // initialData:[],
    enabled: !!this.projectId,
    params: { path: { projectId: this.projectId } },
  }));

  public tasks = injectOpenapiQuery.GET('/api/tasks/project/{projectId}', () => ({
    // initialData:[],
    enabled: !!this.projectId,
    params: { path: { projectId: this.projectId } },
  }));

  public get data() {
    return {
      project: this.project.data(),
      tasks: this.tasks.data(),
      memberships: this.projectMembers.data(),
    };
  }

  public tasksGroups = computed(() => {
    const tasks = this.tasks.data() ?? [];
    return {
      todo: tasks.filter((task) => task.status === 'TODO'),
      blocked: tasks.filter((task) => task.status === 'BLOCKED'),
      inProgress: tasks.filter((task) => task.status === 'DOING'),
      done: tasks.filter((task) => task.status === 'DONE'),
    };
  });

  public readonly currentMembership = computed(
    () =>
      this.projectMembers.data()?.find((membership) => membership.userId === this.auth.user?.id) ??
      null
  );

  public readonly currentRole = computed(()=>this.currentMembership()?.role ?? null)

  public isPending = computed(
    () =>
      this.projectMembers.status() === 'pending' ||
      this.project.status() === 'pending' ||
      this.tasks.status() === 'pending'
  );

  readonly isInviteDialogOpen = signal(false);
  readonly isNewTaskDialogOpen = signal(false);
  readonly taskDetailDialogTaskId = signal<number | null>(null);

  get isTaskDetailDialogOpen() {
    return this.taskDetailDialogTaskId() !== null;
  }


  public showInviteDialog() {
    this.isInviteDialogOpen.set(true);
  }

  public showTaskDetailDialog(taskId: number) {
    this.taskDetailDialogTaskId.set(taskId);
  }

  public hideTaskDetailDiaog() {
    this.taskDetailDialogTaskId.set(null);
  }

  public handleNewTaskSuccess(taskId:number){
    this.tasks.refetch()
    this.showTaskDetailDialog(taskId)
  }
}