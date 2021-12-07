import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiurlService } from 'src/app/services/apiurl.service';
import { SettingsService } from 'src/app/services/settings.service';

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
      <h1 mat-dialog-title>Settings</h1>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div mat-dialog-content>
      <mat-label>API address</mat-label>
      <mat-radio-group [(ngModel)]="apiType" class="radio-group-vertical">
        <mat-radio-button value="local">Local api (http://localhost:8080)</mat-radio-button>
        <mat-radio-button value="remote">
          <mat-form-field>
            <input matInput placeholder="URL" [(ngModel)]="apiUrl" />
          </mat-form-field>
        </mat-radio-button>
      </mat-radio-group>
    </div>
    <div mat-dialog-actions class="action-buttons-right">
      <button mat-button (click)="applySettings()">Apply</button>
    </div>
  `
})
export class SettingsDialogComponent implements OnInit {
  apiType: string = "";
  apiUrl: string = "";

  constructor(private settingsService: SettingsService,
    private apiurlService: ApiurlService,
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.apiUrl = this.apiurlService.getApiUrl();
    this.apiType = this.isApiLocal() ? "local" : "remote";
  }

  public isApiLocal(): boolean {
    return this.apiurlService.getApiUrl() === "http://localhost:8080";
  }

  public applySettings(): void {
    this.apiType === "local" ? this.apiurlService.setLocalApi() : this.apiurlService.setApiUrl(this.apiUrl);
    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

}
