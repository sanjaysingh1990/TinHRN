
import { Achievement } from '../models/Achievement';
import { Favorite } from '../models/Favorite';
import { TeamMember } from '../models/TeamMember';

export interface IProfileRepository {
  getAchievements(): Promise<Achievement[]>;
  getFavorites(): Promise<Favorite[]>;
  getTeamMembers(): Promise<TeamMember[]>;
}
