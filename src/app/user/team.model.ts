// team.model.ts
import { User } from './user.model';

export interface Team {
  id: number;
  name: string;
  members: User[];
}
