import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { TaskCoreDTO } from '@core/api/types';
import { PriorityTag } from '@shared/priority-tag/priority-tag';
import { StatusTag } from '@shared/status-tag/status-tag';
@Component({
  standalone: true,
  selector: 'app-task-card',
  imports: [CommonModule, StatusTag, PriorityTag],
  template: `
    @if(task){
    <button type="button" class="col-span-3 app-card app-card-clickable w-full" (click)="(this.click)">
      <div class="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">
        {{ task.name || 'Tâche' }}
      </div>

      <div class="rflex gap-2">
        <app-status-tag [status]="task.status" />
        <app-priority-tag [priority]="task.priority" />
      </div>
      <p class="text-gray-700 flex-1 text-sm">{{ task.description }}</p>

      <div class="rflex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700">
        @if(task.dueDate){
        <div>À rendre le {{ task.dueDate | date : 'shortDate' }}</div>
        } @if(task.completedDate){
        <div>Terminé le {{ task.completedDate | date : 'shortDate' }}</div>
        }
      </div>
    </button>
    }
  `,
})
export class TaskCard {
  @Input({ required: true })
  public task!: TaskCoreDTO | undefined;

  public click = output();
}
