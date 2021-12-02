import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssignPageComponent } from './views/pages/assign-page/assign-page.component';
import { BrowsePageComponent } from './views/pages/browse-page/browse-page.component';
import { AppbarComponent } from './views/components/appbar/appbar.component';
import { MaterialModule } from './shared/modules/material/material.module';
import { LoginPageComponent } from './views/pages/login-page/login-page.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginDialogComponent } from './views/components/dialogs/login-dialog/login-dialog.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavbarComponent } from './views/components/navbar/navbar.component';
import { SettingsDialogComponent } from './views/components/dialogs/settings-dialog/settings-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AssignPageComponent,
    BrowsePageComponent,
    AppbarComponent,
    LoginPageComponent,
    LoginDialogComponent,
    NavbarComponent,
    SettingsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {return localStorage.getItem("token")}
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
