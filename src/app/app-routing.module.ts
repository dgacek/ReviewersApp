import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignPageComponent } from './views/pages/assign-page/assign-page.component';
import { BrowsePageComponent } from './views/pages/browse-page/browse-page.component';

const routes: Routes = [
  { path: 'assign', component: AssignPageComponent },
  { path: 'browse', component: BrowsePageComponent },
  { path: '', redirectTo: '/browse', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
