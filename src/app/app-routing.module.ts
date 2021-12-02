import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { AssignPageComponent } from './views/pages/assign-page/assign-page.component';
import { BrowsePageComponent } from './views/pages/browse-page/browse-page.component';
import { LoginPageComponent } from './views/pages/login-page/login-page.component';
import { SettingsPageComponent } from './views/pages/settings-page/settings-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'settings', component:SettingsPageComponent },
  { path: 'assign', component: AssignPageComponent, canActivate: [AuthGuardService] },
  { path: 'browse', component: BrowsePageComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/browse', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
