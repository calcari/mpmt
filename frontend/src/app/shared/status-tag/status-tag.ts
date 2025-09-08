import { Component, Input } from '@angular/core';
import { paths } from '@core/api/schema';
import { TaskStatus } from '@core/api/types';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-status-tag',
  imports: [TagModule],
  templateUrl: './status-tag.html',
  styleUrl: './status-tag.css',
})
export class StatusTag {
  @Input({required:true}) status!: TaskStatus | null | undefined;
  @Input() class = '';
}
