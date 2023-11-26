import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { TeamComponent } from './team/team.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


@NgModule({
  declarations: [
    UserListComponent,
    TeamComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatPaginatorModule,
    FormsModule,
    LazyLoadImageModule,
    ModalModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],

})
export class UserModule { }
