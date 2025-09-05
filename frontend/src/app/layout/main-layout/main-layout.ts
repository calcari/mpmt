import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Drawer } from '../drawer/drawer';
import { ButtonModule } from 'primeng/button';
import { Logo } from "@shared/logo/logo";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Drawer, ButtonModule, Logo],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  drawerOpen = signal(false)
  toggleDrawer(){
    this.drawerOpen.update(prev=>!prev)
  }
}
