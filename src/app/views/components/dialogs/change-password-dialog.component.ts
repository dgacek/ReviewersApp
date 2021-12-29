import { Component} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/rest/user.service';

@Component({
  selector: 'app-change-password-dialog',
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
      <h1 mat-dialog-title>Zmiana hasła</h1>
      <div class="spacer"></div>
      <button mat-icon-button (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div mat-dialog-content class="dialog-content">
      <mat-form-field>
        <mat-label>Stare hasło</mat-label>
        <input matInput [formControl]="oldPasswordFormControl" type="password">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Nowe hasło</mat-label>
        <input matInput [formControl]="newPasswordFormControl" type="password">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Powtórz hasło</mat-label>
        <input matInput [formControl]="confirmPasswordFormControl" type="password">
      </mat-form-field>
    </div>
    <div mat-dialog-actions style="float: right;">
      <button mat-stroked-button (click)="processForm()">Zatwierdź</button>
      <button mat-stroked-button (click)="closeDialog()">Anuluj</button>
    </div>
  `
})
export class ChangePasswordDialogComponent {

  oldPasswordFormControl: FormControl = new FormControl('', [Validators.required]);
  newPasswordFormControl: FormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl: FormControl = new FormControl('', [Validators.required]);

  constructor(private userService: UserService, 
    private snackbar: MatSnackBar, 
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>
  ) { }

  processForm(): void {
    if (this.oldPasswordFormControl.value.length === 0 
      || this.newPasswordFormControl.value.length === 0 
      || this.confirmPasswordFormControl.value.length === 0)
      this.snackbar.open("Pola nie mogą być puste", "OK", { duration: 3000 });
    else if (this.newPasswordFormControl.value !== this.confirmPasswordFormControl.value)
      this.snackbar.open("Hasło i powtórzone hasło nie są zgodne", "OK", { duration: 3000 });
    else if (this.newPasswordFormControl.value === this.oldPasswordFormControl.value)
      this.snackbar.open("Nowe hasło nie może być takie samo jak stare", "OK", { duration: 3000 });
    else {
      this.userService.changePassword({oldPassword: this.oldPasswordFormControl.value, newPassword: this.newPasswordFormControl.value}).subscribe({
        next: () => this.closeDialog(),
        error: () => this.snackbar.open("Nieoczekiwany błąd", "OK", { duration: 3000 })
      })
    }
  }
  
  closeDialog(requestListUpdate?: boolean): void {
    this.snackbar.dismiss();
    this.dialogRef.close({ requestListUpdate: requestListUpdate });
  }

}
