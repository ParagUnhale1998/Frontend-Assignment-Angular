import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { TeamComponent } from './team/team.component';


@NgModule({
  declarations: [
    UserListComponent,
    TeamComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    
  ]
})
export class UserModule { }
