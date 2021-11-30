import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper: JwtHelperService, private router: Router) { }

  redirectUrl: string | null = null;

  public logout(): void {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }
  
  public getAuthToken(): string {
    return localStorage.getItem("token")!;
  }

  public setAuthToken(token: string) {
    localStorage.setItem("token", token);
  }
  
  public isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(this.getAuthToken());
  }
}
