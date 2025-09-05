import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-user-chip',
  standalone: true,
  imports: [CommonModule, ChipModule],
  template: `
    <p-chip class="!py-0 !pl-0 !pr-3 {{ this.class }}">
      <span
        class="text-primary-contrast rounded-full aspect-square m-1 mr-0 text-sm h-5 center"
        [ngClass]="this.self ? 'bg-emerald-700' : 'bg-primary'"
      >
        {{ username?.[0]?.toUpperCase() ?? "?" }}
      </span>
      <span class="text-xs font-medium capitalize">{{ username ?? 'Utilisateur' }}</span>
    </p-chip>
  `,
})
export class AssigneeChipComponent {
  @Input({ required: true }) username!: string | null | undefined;
  @Input('class') class?: string;
  @Input() self?: boolean;
}
