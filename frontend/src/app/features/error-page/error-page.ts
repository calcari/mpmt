import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Logo } from "@shared/logo/logo";

@Component({
  selector: 'app-error-page',
  imports: [ButtonModule, Logo, RouterLink],
  templateUrl: './error-page.html',
  styleUrl: './error-page.css',
})
export class ErrorPage {
  route = inject(ActivatedRoute);

  readonly message = this.route.snapshot.queryParamMap.get('message');
  readonly status = this.route.snapshot.queryParamMap.get('status');
}
