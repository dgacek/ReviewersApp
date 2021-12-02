import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss']
})
export class AppbarComponent {

  constructor(private auth: AuthService) { }

  public isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  public logout(): void {
    this.auth.logout();
  }
}
