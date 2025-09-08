import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.css'
})
export class Logo {
  @Input() iconClass = '';
  @Input() textClass = '';
}
