import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Team } from './team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamServiceService {
private teamSubject =  new BehaviorSubject<Team[]>([])

teams$ = this.teamSubject.asObservable();

  constructor() { }

  addTeam(team:Team){
    const currentTeam = this.teamSubject.value;
    this.teamSubject.next([...currentTeam,team])
  }
}
