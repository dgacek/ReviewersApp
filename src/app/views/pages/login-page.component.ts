import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  styles: [`
    .center {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `],
  template: `
    <div class="center">
      <app-login-dialog></app-login-dialog>
    </div>
  `
})
export class LoginPageComponent {}
