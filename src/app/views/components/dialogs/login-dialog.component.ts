import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginService } from 'src/app/services/rest/login.service';
import { AuthResponseDTO } from 'src/app/shared/types/dto/auth/AuthResponseDTO';

@Component({
  selector: 'app-login-dialog',
  styles: [`
    .center {
      width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 205px;
    }
  `],
  template: `
    <div class="center">
      <h1 mat-dialog-title>Login</h1>
      <div mat-dialog-content>
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="username">
        </mat-form-field>
        <br>
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" [(ngModel)]="password">
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-raised-button color="accent" (click)="processForm()">Login</button>
      </div>
    </div>
  `
})
export class LoginDialogComponent {
  
  private _username?: string = undefined;
  public get username(): string | undefined {
    return this._username;
  }
  public set username(value: string | undefined) {
    this._username = value;
  }
  
  private _password?: string = undefined;
  public get password(): string | undefined {
    return this._password;
  }
  public set password(value: string | undefined) {
    this._password = value;
  }

  constructor(private loginService: LoginService, private auth: AuthService, private router: Router) { }

  public processForm(): void {
    if (this._username && this._password) {
      this.loginService.login({username: this._username, password: this._password}).subscribe(
        (response: AuthResponseDTO) => {
          this.auth.setAuthToken(response.token);
          this.router.navigate(["/assign"]);
        }
      )
    }
  }

}