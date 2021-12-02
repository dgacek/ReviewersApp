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
  private _apiType: string = "";
  private _apiUrl: string = "";

  api = {local: true, url: ""};

  public get apiType(): string {
    return this._apiType;
  }
  public set apiType(value: string) {
    this._apiType = value;
    this.updateApi();
  } 
  
  public get apiUrl(): string {
    return this._apiUrl;
  }
  public set apiUrl(value: string) {
    this._apiUrl = value;
    this.updateApi();
  }

  constructor(private settingsService: SettingsService,
    private apiurlService: ApiurlService,
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.apiUrl = this.apiurlService.getApiUrl();
  }

  private updateApi(): void {
    this.api.local = (this.apiType === "local");
    this.api.url = this.apiType === "local" ? "" : this.apiUrl;
  }

}
