import { Component,OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  usersForPage: User[] = [];
  pageSize = 20;
  currentPage = 1;
 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      console.log(data)
      this.updateUsersForPage();
    });
  }

  updateUsersForPage() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.usersForPage = this.users.slice(startIndex, endIndex);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.updateUsersForPage();
  }
  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}
