import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  styles: [`

  `],
  template: `
    <nav mat-tab-nav-bar mat-align-tabs="center">
      <a mat-tab-link routerLink="/assign" routerLinkActive #rla1="routerLinkActive"
        [routerLinkActiveOptions]="{exact:true}" [active]="rla1.isActive">Przypisywanie</a>
      <a mat-tab-link routerLink="/browse" routerLinkActive #rla2="routerLinkActive"
        [routerLinkActiveOptions]="{exact:true}" [active]="rla2.isActive">Przeglądanie</a>
    </nav>
  `
})
export class NavbarComponent {}
