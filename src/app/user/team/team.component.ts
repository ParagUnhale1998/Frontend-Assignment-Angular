import { Component ,OnInit} from '@angular/core';
import { TeamServiceService } from '../team-service.service';
import { Team } from '../team.model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit{
  teams: Team[] = [];

  constructor(private teamService: TeamServiceService) {}
 
  ngOnInit(): void {
    this.teamService.teams$.subscribe((teams) => {
      this.teams = teams;
      console.log(teams)
    });
  }
}
