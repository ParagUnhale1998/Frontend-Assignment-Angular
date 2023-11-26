import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamServiceService } from '../team-service.service';
import { Team } from '../team.model';
import { TeamComponent } from '../team/team.component';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { Subject, catchError, debounceTime, distinctUntilChanged, throwError } from 'rxjs';

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
  totalPages = 0;
  selectedDomain = '';
  selectedGender = '';
  selectedAvailability = '';
  uniqueDomains: string[] = [];
  searchUser: string = '';
  teamData = 0;
  warning = false;
  ShowInformation:boolean = true
  private modalService = inject(NgbModal);
  private searchInputSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private teamService: TeamServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.searchInputSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(inputName => {
        // console.log(inputName)
        this.onSearch(inputName);
      });
  }

  getUsers(): void {
    this.userService.getUsers().pipe(catchError((error) => {
      console.error('Error fetching users:', error);
      return throwError(() => new Error('Error Fetching Data'));
    })).subscribe({
      next : (data) => {
        this.users = data;
        console.log(data);
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        console.log(this.totalPages);
        console.log(50 * 20);
        this.uniqueDomains = this.getUniqueDomains();
        this.updateUsersForPage();
      },
      error :(error) => {
        console.error('Error fetching users:', error);
      }
     } );
  }

  updateUsersForPage(): void {
    let filteredUsers = this.users;

    if (this.selectedDomain) {
      filteredUsers = filteredUsers.filter(
        (user) => user.domain === this.selectedDomain
      );
    }

    if (this.selectedGender) {
      filteredUsers = filteredUsers.filter(
        (user) => user.gender === this.selectedGender
      );
    }

    if (this.selectedAvailability !== '') {
      const availability = this.selectedAvailability === 'true';
      filteredUsers = filteredUsers.filter(
        (user) => user.available === availability
      );
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.usersForPage = filteredUsers.slice(startIndex, endIndex);
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.updateUsersForPage();
  }

  private getUniqueDomains(): string[] {
    const uniqueDomains = [...new Set(this.users.map((user) => user.domain))];
    return uniqueDomains;
  }

  onSearch(inputName: string): void {
    this.searchUser = inputName;
    console.log('calling Search Function')
    this.currentPage = 1;

    if (this.searchUser.trim() === '') {
      this.updateUsersForPage();
    } else {
      if (
        this.selectedDomain ||
        this.selectedGender ||
        this.selectedAvailability !== ''
      ) {
        console.log('Filter Searches');
        this.usersForPage = this.usersForPage.filter(
          (user) =>
            user.first_name
              .toLowerCase()
              .includes(this.searchUser.toLowerCase()) ||
            user.last_name.toLowerCase().includes(this.searchUser.toLowerCase())
        );
      } else {
        console.log('Without Filter Search');
        this.usersForPage = this.users.filter(
          (user) =>
            user.first_name
              .toLowerCase()
              .includes(this.searchUser.toLowerCase()) ||
            user.last_name.toLowerCase().includes(this.searchUser.toLowerCase())
        );
      }
    }
   
  }
  handleSearchInputChange(event: any): void {
    const inputValue = event?.target?.value || ''; // handle null or undefined
    this.searchInputSubject.next(inputValue);
  }
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (!this.searchUser) {
        this.updateUsersForPage();
      }
    }
  }

  getUserAvatarUrl(avatarUrl: string): string {
    return avatarUrl.split('?')[0];
  }

  open(): void {
    const modalRef = this.modalService.open(TeamComponent, { size: 'xl' });
  }

  createTeam(selectedUsers: User[]): void {
    if (selectedUsers.length === 0) {
      console.log('No users selected for the team.');
      this.warning = true;
      setTimeout(() => {
        this.warning = false;
      }, 1000);
      return;
    }

    const uniqueDomains = [
      ...new Set(selectedUsers.map((user) => user.domain)),
    ];
    const teamMembers: User[] = [];

    uniqueDomains.forEach((domain) => {
      const userInDomain = selectedUsers.find((user) => user.domain === domain);
      if (userInDomain) {
        teamMembers.push(userInDomain);
      }
    });

    const team: Team = {
      id: this.teamData,
      name: `Team ${this.teamData}`,
      members: teamMembers,
    };
    console.log(team);
    this.teamService.addTeam(team);

    this.teamData++;
    this.resetSelection();
  }

  getSelectedUsers(): User[] {
    return this.users.filter((user) => user.selected);
  }

  resetSelection(): void {
    this.usersForPage.forEach((user) => (user.selected = false));
  }

  selectUser(user: any): boolean {
    return (user.selected = !user.selected);
  }

  // NavigateToTeams(): void {
  //   console.log('Navigate to teams');
  //   this.router.navigateByUrl('users/team');
  // }
}
/*import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamServiceService } from '../team-service.service';
import { Team } from '../team.model';
import { TeamComponent } from '../team/team.component';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

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
  totalPages = 0;
  selectedDomain = '';
  selectedGender = '';
  selectedAvailability = '';
  uniqueDomains: string[] = [];
  searchUser: string = '';
  teamData = 0;
  warning = false;
  ShowInformation:boolean = true
  private modalService = inject(NgbModal);
  private searchInputSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private teamService: TeamServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.searchInputSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(inputName => {
        // console.log(inputName)
        this.onSearch(inputName);
      });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        console.log(data);
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        console.log(this.totalPages);
        console.log(50 * 20);
        this.uniqueDomains = this.getUniqueDomains();
        this.updateUsersForPage();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  updateUsersForPage(): void {
    let filteredUsers = this.users;

    if (this.selectedDomain) {
      filteredUsers = filteredUsers.filter(
        (user) => user.domain === this.selectedDomain
      );
    }

    if (this.selectedGender) {
      filteredUsers = filteredUsers.filter(
        (user) => user.gender === this.selectedGender
      );
    }

    if (this.selectedAvailability !== '') {
      const availability = this.selectedAvailability === 'true';
      filteredUsers = filteredUsers.filter(
        (user) => user.available === availability
      );
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.usersForPage = filteredUsers.slice(startIndex, endIndex);
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.updateUsersForPage();
  }

  private getUniqueDomains(): string[] {
    const uniqueDomains = [...new Set(this.users.map((user) => user.domain))];
    return uniqueDomains;
  }

  onSearch(inputName: string): void {
    this.searchUser = inputName;
    console.log('calling Search Function')
    this.currentPage = 1;

    if (this.searchUser.trim() === '') {
      this.updateUsersForPage();
    } else {
      if (
        this.selectedDomain ||
        this.selectedGender ||
        this.selectedAvailability !== ''
      ) {
        console.log('Filter Searches');
        this.usersForPage = this.usersForPage.filter(
          (user) =>
            user.first_name
              .toLowerCase()
              .includes(this.searchUser.toLowerCase()) ||
            user.last_name.toLowerCase().includes(this.searchUser.toLowerCase())
        );
      } else {
        console.log('Without Filter Search');
        this.usersForPage = this.users.filter(
          (user) =>
            user.first_name
              .toLowerCase()
              .includes(this.searchUser.toLowerCase()) ||
            user.last_name.toLowerCase().includes(this.searchUser.toLowerCase())
        );
      }
    }
   
  }
  handleSearchInputChange(event: any): void {
    const inputValue = event?.target?.value || ''; // handle null or undefined
    this.searchInputSubject.next(inputValue);
  }
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (!this.searchUser) {
        this.updateUsersForPage();
      }
    }
  }

  getUserAvatarUrl(avatarUrl: string): string {
    return avatarUrl.split('?')[0];
  }

  open(): void {
    const modalRef = this.modalService.open(TeamComponent, { size: 'xl' });
  }

  createTeam(selectedUsers: User[]): void {
    if (selectedUsers.length === 0) {
      console.log('No users selected for the team.');
      this.warning = true;
      setTimeout(() => {
        this.warning = false;
      }, 1000);
      return;
    }

    const uniqueDomains = [
      ...new Set(selectedUsers.map((user) => user.domain)),
    ];
    const teamMembers: User[] = [];

    uniqueDomains.forEach((domain) => {
      const userInDomain = selectedUsers.find((user) => user.domain === domain);
      if (userInDomain) {
        teamMembers.push(userInDomain);
      }
    });

    const team: Team = {
      id: this.teamData,
      name: `Team ${this.teamData}`,
      members: teamMembers,
    };
    console.log(team);
    this.teamService.addTeam(team);

    this.teamData++;
    this.resetSelection();
  }

  getSelectedUsers(): User[] {
    return this.users.filter((user) => user.selected);
  }

  resetSelection(): void {
    this.usersForPage.forEach((user) => (user.selected = false));
  }

  selectUser(user: any): boolean {
    return (user.selected = !user.selected);
  }
*/
/*users: User[] = [];
  usersForPage: User[] = [];
  pageSize = 20;
  currentPage = 1;
  totalPages = 0;
  selectedDomain = '';
  selectedGender = '';
  selectedAvailability = '';
  uniqueDomains: string[] = [];
  searchUser=''
  teamData: number = 0;
  warning:boolean =false
  private modalService = inject(NgbModal);
  constructor(private userService: UserService,private teamService:TeamServiceService,private roter:Router) {}

  open() {
    const modalRef = this.modalService.open(TeamComponent,{ size: 'xl' });
  }
	

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      console.log(data)
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      console.log(this.totalPages)
      console.log(50*20)
      this.uniqueDomains = this.getUniqueDomains();
      this.updateUsersForPage();
    });
  }

  updateUsersForPage() {
   
    let filteredUsers = this.users;

    if (this.selectedDomain) {
      filteredUsers = filteredUsers.filter((user) => user.domain === this.selectedDomain);
    }

    if (this.selectedGender) {
      filteredUsers = filteredUsers.filter((user) => user.gender === this.selectedGender);
    }

    if (this.selectedAvailability !== '') {
      const availability = this.selectedAvailability === 'true';
      filteredUsers = filteredUsers.filter((user) => user.available === availability);
    }


    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.usersForPage = filteredUsers.slice(startIndex, endIndex);
  }


  applyFilters() {
    this.currentPage = 1
    this.updateUsersForPage();
  }

  private getUniqueDomains(): string[] {
    const uniqueDomains = [...new Set(this.users.map((user) => user.domain))];
    return uniqueDomains
  }


  onSearch(inputName:any) {
    this.searchUser = inputName;
    this.currentPage = 1;
    if ( this.searchUser.trim() === '') {
      this.updateUsersForPage();

    } else {
      if(this.selectedDomain || this.selectedGender || this.selectedAvailability !== ''){
        console.log('Filter Searches')
        this.usersForPage = this.usersForPage.filter(user =>
          user.first_name.toLowerCase().includes( this.searchUser.toLowerCase()) ||
          user.last_name.toLowerCase().includes( this.searchUser.toLowerCase())
          );
      }else{
        console.log('Without Filter Search')
        this.usersForPage = this.users.filter(user =>
          user.first_name.toLowerCase().includes( this.searchUser.toLowerCase()) ||
          user.last_name.toLowerCase().includes( this.searchUser.toLowerCase())
          );
      }
    
    }
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if(!this.searchUser){
        this.updateUsersForPage();
      }
    }
  }

  getUserAvatarUrl(avatarUrl: string): string {
    return avatarUrl.split("?")[0];
  }
  createTeam(selectedUsers: User[]): void {
    if (selectedUsers.length === 0) {
      console.log('No users selected for the team.');
      setTimeout(() => {
        this.warning = false
      },1000)
      this.warning = true
      return;
    }
    const uniqueDomains = [...new Set(selectedUsers.map(user => user.domain))];
    const teamMembers: User[] = [];
  
    uniqueDomains.forEach(domain => {
      const userInDomain = selectedUsers.find(user => user.domain === domain);
      if (userInDomain) {
        teamMembers.push(userInDomain);
      }
    });
  
    const team: Team = {
      id: this.teamData,
      name: `Team ${this.teamData}`,
      members: teamMembers,
    };
    console.log(team);
    this.teamService.addTeam(team);
  
    this.teamData++;
    this.resetSelection();
  }
  
  
  getSelectedUsers(): User[] {
    return this.users.filter(user => user.selected);
  }
  
  resetSelection(): void {
    this.usersForPage.forEach(user => user.selected = false);
  }
  selectUser(user: any) {
    return user.selected = !user.selected;
  }

  NavigateToTeams(){
    console.log('teams')
 this.roter.navigateByUrl('users/team')
  }
}
*/
