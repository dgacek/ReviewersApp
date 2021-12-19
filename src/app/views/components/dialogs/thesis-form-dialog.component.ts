import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { ThesisService } from 'src/app/services/rest/thesis.service';

@Component({
  selector: 'app-thesis-form-dialog',
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
      <h1 mat-dialog-title>{{prefs?.edit === true ? "Edit thesis" : "Add thesis"}}</h1>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div mat-dialog-content class="dialog-content">
      <mat-form-field>
        <mat-label>Topic</mat-label>
        <input matInput [formControl]="topicFormControl">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Author album number</mat-label>
        <input matInput [formControl]="authorAlbumNumberFormControl">
      </mat-form-field>
    </div>
    <div mat-dialog-actions style="float: right;">
      <button mat-stroked-button (click)="processForm()">Confirm</button>
      <button mat-stroked-button (click)="closeDialog()">Cancel</button>
    </div>
  `
})
export class ThesisFormDialogComponent implements OnInit {

  selectedThesisId$: Observable<number>;
  topicFormControl: FormControl = new FormControl('', [Validators.required]);
  authorAlbumNumberFormControl: FormControl = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<ThesisFormDialogComponent>,
    private thesisService: ThesisService,
    private store: Store<AppState>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) readonly prefs?: { edit: boolean }) {
    this.selectedThesisId$ = store.select('selectedThesisId');
  }

  ngOnInit(): void {
    if (this.prefs?.edit === true) {
      this.selectedThesisId$.pipe(take(1)).subscribe((selectedThesisId) => this.thesisService.get(selectedThesisId).subscribe(
        {
          next: (response) => {
            this.topicFormControl.setValue(response[0].topic);
            this.authorAlbumNumberFormControl.setValue(response[0].authorAlbumNumber);
          }
        }
      ))
    }
  }

  processForm(): void {
    if (this.topicFormControl.value.length === 0)
      this.snackbar.open("Topic cannot be empty", "Close", { duration: 3000 });
    else if (this.authorAlbumNumberFormControl.value.length === 0)
      this.snackbar.open("Author album number cannot be empty", "Close", { duration: 3000 });
    else {
      if (this.prefs?.edit === true) {
        this.selectedThesisId$.pipe(take(1)).subscribe(
          (selectedThesisId) => {
            this.thesisService.update({ id: selectedThesisId, topic: this.topicFormControl.value, authorAlbumNumber: this.authorAlbumNumberFormControl.value, reviewerId: null }).subscribe(
              {
                next: () => this.closeDialog(true),
                error: () => this.snackbar.open("Unknown error", "Close", { duration: 3000 })
              }
            )
          }
        )
      } else {
        this.thesisService.add({ topic: this.topicFormControl.value, authorAlbumNumber: this.authorAlbumNumberFormControl.value }).subscribe(
          {
            next: () => this.closeDialog(true),
            error: () => this.snackbar.open("Unknown error", "Close", { duration: 3000 })
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
