import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacultyService } from 'src/app/services/rest/faculty.service';

@Component({
  selector: 'app-faculty-form-dialog',
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
      <h1 mat-dialog-title>{{prefs?.editId ? "Edycja katedry" : "Dodawanie katedry"}}</h1>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div mat-dialog-content class="dialog-content">
      <mat-form-field>
        <mat-label>Symbol</mat-label>
        <input matInput [formControl]="symbolFormControl">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Nazwa</mat-label>
        <input matInput [formControl]="nameFormControl">
      </mat-form-field>
    </div>
    <div mat-dialog-actions style="float: right;">
      <button mat-stroked-button (click)="processForm()">Zatwierdź</button>
      <button mat-stroked-button (click)="closeDialog()">Anuluj</button>
    </div>
  `
})
export class FacultyFormDialogComponent implements OnInit {

  symbolFormControl: FormControl = new FormControl('', [Validators.required]);
  nameFormControl: FormControl = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<FacultyFormDialogComponent>,
    private facultyService: FacultyService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) readonly prefs?: { editId?: number }) { }

  ngOnInit(): void {
    if (this.prefs?.editId) {
      this.facultyService.get(this.prefs.editId).subscribe(
        {
          next: (response) => {
            this.symbolFormControl.setValue(response[0].symbol);
            this.nameFormControl.setValue(response[0].name);
          }
        }
      )
    }
  }

  processForm(): void {
    if (this.symbolFormControl.value.length === 0)
      this.snackbar.open("Symbol nie może być pusty", "OK", { duration: 3000 });
    else if (this.nameFormControl.value.length === 0)
      this.snackbar.open("Nazwa nie może być pusta", "OK", { duration: 3000 });
    else {
      if (this.prefs?.editId) {
        this.facultyService.update({ id: this.prefs.editId, symbol: this.symbolFormControl.value, name: this.nameFormControl.value }).subscribe(
          {
            next: () => this.closeDialog(true),
            error: () => this.snackbar.open("Nieoczekiwany błąd", "OK", { duration: 3000 })
          }
        )
      } else {
        this.facultyService.add({ symbol: this.symbolFormControl.value, name: this.nameFormControl.value }).subscribe(
          {
            next: () => this.closeDialog(true),
            error: () => this.snackbar.open("Nieoczekiwany błąd", "OK", { duration: 3000 })
          }
        )
      }
    }
  }

  closeDialog(requestListUpdate?: boolean): void {
    this.snackbar.dismiss();
    this.dialogRef.close({ requestListUpdate: requestListUpdate });
  }

}
