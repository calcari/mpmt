import { Component, inject, input, Input, model, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {AvatarModule} from "primeng/avatar"
import {BadgeModule} from "primeng/badge"
import { ButtonModule } from 'primeng/button';
import { DrawerModule, Drawer as PDrawer } from 'primeng/drawer';
import { Logo } from "@shared/logo/logo";
import { MenuItem } from 'primeng/api';
import { AuthService } from '@core/auth/auth-service';

@Component({
  selector: 'app-drawer',
  imports: [RouterLink, RouterLinkActive, AvatarModule, BadgeModule, DrawerModule, ButtonModule, Logo],
  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
})
export class Drawer {

  readonly isOpen = model.required<boolean>();

  authService = inject(AuthService)

  items:MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/home' },
    { label: 'Projects', icon: 'pi pi-bolt', routerLink: '/projects' },
  ];
}
