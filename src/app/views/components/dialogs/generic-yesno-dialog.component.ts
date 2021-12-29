import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-yesno-dialog',
  styles: [`
    .dialog-header {
      display: flex;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
    }
  `],
  template: `
    <div class="dialog-header">
      <h1 mat-dialog-title>{{data.title}}</h1>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeDialog(false)">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div mat-dialog-content class="dialog-content">
      {{data.text}}
    </div>
    <div mat-dialog-actions style="float: right;">
      <button mat-stroked-button (click)="closeDialog(true)">
        Tak
      </button>
      <button mat-stroked-button (click)="closeDialog(false)">
        Nie
      </button>
    </div>
  `
})
export class GenericYesnoDialogComponent {
  constructor(private dialogRef: MatDialogRef<GenericYesnoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: {title: string, text: string}) { }

  closeDialog(isYes: boolean): void {
    this.dialogRef.close(isYes);
  }
}
