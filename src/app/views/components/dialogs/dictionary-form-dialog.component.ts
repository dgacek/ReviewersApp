import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryService } from 'src/app/services/rest/dictionary.service';

@Component({
  selector: 'app-dictionary-form-dialog',
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
      <h1 mat-dialog-title>{{prefs?.editId ? "Edit" : "Add"}} {{prefs?.valueType}}</h1>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div mat-dialog-content class="dialog-content">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput [formControl]="nameFormControl">
      </mat-form-field>
    </div>
    <div mat-dialog-actions style="float: right;">
      <button mat-stroked-button (click)="processForm()">Confirm</button>
      <button mat-stroked-button (click)="closeDialog()">Cancel</button>
    </div>
  `
})
export class DictionaryFormDialogComponent implements OnInit {

  nameFormControl = new FormControl('', [Validators.required]);

  constructor(private dictionaryService: DictionaryService,
    private dialogRef: MatDialogRef<DictionaryFormDialogComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) readonly prefs?: { editId?: number, valueType: string }) { }

  ngOnInit(): void {
    if (this.prefs?.editId) {
      this.dictionaryService.get(this.prefs.valueType, this.prefs.editId).subscribe(
        {
          next: (response) => {
            this.nameFormControl.setValue(response[0].name);
          }
        }
      )
    }
  }

  closeDialog(requestListUpdate?: boolean): void {
    this.snackbar.dismiss();
    this.dialogRef.close({ requestListUpdate: requestListUpdate });
  }

  processForm(): void {
    if (this.nameFormControl.value.length === 0)
      this.snackbar.open("Name cannot be empty", "Close", { duration: 3000 });
    else {
      if (this.prefs?.editId) {
        this.dictionaryService.update(this.prefs.valueType, { id: this.prefs.editId, name: this.nameFormControl.value }).subscribe(
          {
            next: () => this.closeDialog(true),
            error: () => this.snackbar.open("Unknown error", "Close", { duration: 3000 })
          }
        )
      } else {
        this.dictionaryService.add(this.prefs!.valueType, { name: this.nameFormControl.value }).subscribe(
          {
            next: () => this.closeDialog(true),
            error: () => this.snackbar.open("Unknown error", "Close", { duration: 3000 })
          }
        )
      }
    }
  }

}
