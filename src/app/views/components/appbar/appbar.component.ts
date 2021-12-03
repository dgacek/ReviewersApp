import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SettingsDialogComponent } from '../dialogs/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss']
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
    let dialogRef = this.dialog.open(SettingsDialogComponent);
  }
}
