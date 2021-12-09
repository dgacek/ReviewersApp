import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssignPageComponent } from './views/pages/assign-page.component';
import { BrowsePageComponent } from './views/pages/browse-page.component';
import { AppbarComponent } from './views/components/appbar.component';
import { MaterialModule } from './shared/modules/material/material.module';
import { LoginPageComponent } from './views/pages/login-page.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginDialogComponent } from './views/components/dialogs/login-dialog.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavbarComponent } from './views/components/navbar.component';
import { SettingsDialogComponent } from './views/components/dialogs/settings-dialog.component';
import { StoreModule } from '@ngrx/store';
import { selectedThesisIdReducer } from './shared/redux/selected-thesis-id/selected-thesis-id.reducer';
import { selectedReviewerIdReducer } from './shared/redux/selected-reviewer-id/selected-reviewer-id.reducer';
import { ThesisTableAssignComponent } from './views/components/tables/thesis-table-assign.component';
import { ThesisDetailsComponent } from './views/components/thesis-details.component';
import { ReviewerTableAssignComponent } from './views/components/tables/reviewer-table-assign.component';
import { ThesisTableBrowseComponent } from './views/components/tables/thesis-table-browse.component';
import { ReviewerTableBrowseComponent } from './views/components/tables/reviewer-table-browse.component';
import { ThesesToolbarComponent } from './views/components/theses-toolbar.component';
import { ReviewersToolbarComponent } from './views/components/reviewers-toolbar.component';
import { ReviewerFormDialogComponent } from './views/components/dialogs/reviewer-form-dialog.component';
import { DictionaryFormDialogComponent } from './views/components/dialogs/dictionary-form-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AssignPageComponent,
    BrowsePageComponent,
    AppbarComponent,
    LoginPageComponent,
    LoginDialogComponent,
    NavbarComponent,
    SettingsDialogComponent,
    ThesisTableAssignComponent,
    ThesisDetailsComponent,
    ReviewerTableAssignComponent,
    ThesisTableBrowseComponent,
    ReviewerTableBrowseComponent,
    ThesesToolbarComponent,
    ReviewersToolbarComponent,
    ReviewerFormDialogComponent,
    DictionaryFormDialogComponent
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
    }),
    StoreModule.forRoot({ selectedThesisId: selectedThesisIdReducer, selectedReviewerId: selectedReviewerIdReducer })
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
