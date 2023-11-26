import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';

const routes: Routes = [
  { path: 'users', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  // { path: '', component: UserListComponent },
  // { path: '**', component: UserListComponent},
  { path: '', redirectTo: 'users/list', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'users/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
