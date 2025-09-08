import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';

type ProjectRole = "ADMIN" | "MEMBER" | "VIEWER"
@Component({
  selector: 'app-role-tag',
  imports: [TagModule],
  templateUrl: './role-tag.html',
  styleUrl: './role-tag.css'
})
export class RoleTag {
  @Input({required:true}) role!:ProjectRole | null | undefined
  @Input() class = "";
}
