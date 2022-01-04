import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiurlService } from 'src/app/services/apiurl.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';

@Component({
  selector: 'app-settings-dialog',
  styles: [`
    .dialog-header {
      display: flex;
    }

    .radio-group-vertical {
      display: flex;
      flex-direction: column;
    }

    .action-buttons-right {
      float: right;
    }
  `],
  template: `
    <div class="dialog-header">
      <h1 mat-dialog-title>Ustawienia</h1>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div mat-dialog-content>
      <h4>Adres API</h4>
      <p>
        <mat-radio-group [formControl]="apiTypeFormControl" class="radio-group-vertical">
          <mat-radio-button value="local">API lokalne/wbudowane (http://localhost:8080)</mat-radio-button>
          <mat-radio-button value="remote">
            <mat-form-field>
              <input matInput placeholder="URL" [formControl]="apiUrlFormControl" />
            </mat-form-field>
          </mat-radio-button>
        </mat-radio-group>
      </p>
      <div *ngIf="authService.isAuthenticated()">
        <h4>Ustawienia użytkownika</h4>
        <p>
          <button mat-stroked-button (click)="openChangePasswordDialog()">Zmień hasło</button>
        </p>
      </div>
    </div>
    <div mat-dialog-actions class="action-buttons-right">
      <button mat-stroked-button (click)="applySettings()">Zatwierdź</button>
    </div>
  `
})
export class SettingsDialogComponent implements OnInit {
  apiTypeFormControl = new FormControl();
  apiUrlFormControl = new FormControl();

  constructor(private apiurlService: ApiurlService,
    public authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SettingsDialogComponent>) { }

  ngOnInit(): void {
    this.apiUrlFormControl.setValue(this.isApiLocal() ? null : this.apiurlService.getApiUrl());
    this.apiTypeFormControl.setValue(this.isApiLocal() ? "local" : "remote");
  }

  public isApiLocal(): boolean {
    return this.apiurlService.getApiUrl() === "http://localhost:8080";
  }

  public applySettings(): void {
    this.apiTypeFormControl.value === "local" ? this.apiurlService.setLocalApi() : this.apiurlService.setApiUrl(this.apiUrlFormControl.value);
    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordDialogComponent);
  }

}
