import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { AssignPageComponent } from './views/pages/assign-page.component';
import { BrowsePageComponent } from './views/pages/browse-page.component';
import { LoginPageComponent } from './views/pages/login-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'assign', component: AssignPageComponent, canActivate: [AuthGuardService] },
  { path: 'browse', component: BrowsePageComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/assign', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
