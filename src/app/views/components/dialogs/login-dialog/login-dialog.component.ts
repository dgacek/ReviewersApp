import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginService } from 'src/app/services/rest/login.service';
import { AuthResponseDTO } from 'src/app/shared/types/dto/auth/AuthResponseDTO';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
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
          this.router.navigate(["/browse"]);
        }
      )
    }
  }

}
