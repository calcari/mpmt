import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Logo } from '@shared/logo/logo';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, Logo, ButtonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout {

}
