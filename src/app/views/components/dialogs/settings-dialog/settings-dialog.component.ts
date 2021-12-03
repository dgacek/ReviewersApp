import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiurlService } from 'src/app/services/apiurl.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
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
