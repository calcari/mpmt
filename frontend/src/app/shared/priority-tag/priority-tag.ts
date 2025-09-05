import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';

type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

@Component({
  selector: 'app-priority-tag',
  imports: [TagModule],
  templateUrl: './priority-tag.html',
  styleUrl: './priority-tag.css',
})
export class PriorityTag {
  @Input({required:true}) priority!: TaskPriority | null | undefined;
  @Input() class = "";
}
