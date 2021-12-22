import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SettingsDialogComponent } from './dialogs/settings-dialog.component';

@Component({
  selector: 'app-appbar',
  styles: [`
    .root {
      display: flex;
    }

    .title {
      width: auto;
    }

    .action-buttons {
      display: flex;
      width: 116px;
    }
  `],
  template: `
    <mat-toolbar color="primary" class="root">
      <div class="title">ReviewersApp</div>
      <div class="spacer"></div>
      <div class="action-buttons">
        <button mat-icon-button (click)="openSettingsDialog()">
          <mat-icon>settings</mat-icon>
        </button>
        <div *ngIf="isAuthenticated(); else elseBlock">
          <button mat-button (click)="logout()">Wyloguj</button>
        </div>
        <ng-template #elseBlock>
          <button mat-button routerLink="/login" routerLinkActive="active">Zaloguj</button>
        </ng-template>
      </div>
    </mat-toolbar>
  `
})
export class AppbarComponent {

  constructor(private auth: AuthService,
    private dialog: MatDialog) { }

  public isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  public logout(): void {
    this.auth.logout();
  }

  public openSettingsDialog(): void {
    this.dialog.open(SettingsDialogComponent);
  }
}
