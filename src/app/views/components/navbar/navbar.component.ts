import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private auth: AuthService) { }

  public isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  public logout(): void {
    this.auth.logout();
  }
}
