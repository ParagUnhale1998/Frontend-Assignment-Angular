import { Component, inject  } from '@angular/core';
import { User } from './user/user.model';
import { UserService } from './user/user.service';
import { TeamServiceService } from './user/team-service.service';
import { Team } from './user/team.model';
import { Router } from '@angular/router';
import { TeamComponent } from './user/team/team.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  users: User[] = [];
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
    // this.onPageChange(1)
    // Apply filters
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

    // Update users for the current page

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.usersForPage = filteredUsers.slice(startIndex, endIndex);
  }

  // onPageChange(event: any) {
  //   this.currentPage = event.pageIndex;
  //   this.updateUsersForPage();
  // }

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
      // this.usersForPage = this.users;
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



  // updateUsersForPage() {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.usersForPage = this.users.slice(startIndex, endIndex);
  // }

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
    // Check if there are selected users
    if (selectedUsers.length === 0) {
      console.log('No users selected for the team.');
      // alert('Select the Users For Team')
      setTimeout(() => {
        this.warning = false
      },1000)
      this.warning = true
      return;
    }
    // Implement your logic to create a single team
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
  
    // Increment team data only when a team is created
    this.teamData++;
    this.resetSelection();
  }
  
  
  getSelectedUsers(): User[] {
    return this.users.filter(user => user.selected);
  }
  
  resetSelection(): void {
    this.usersForPage.forEach(user => user.selected = false);
  }

  NavigateToTeams(){
    console.log('teams')
 this.roter.navigateByUrl('users/team')
  }
}