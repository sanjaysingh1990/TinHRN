import { Achievement } from '../models/Achievement';
import { Faq } from '../models/Faq';
import { Favorite } from '../models/Favorite';
import { TeamMember } from '../models/TeamMember';

export interface IProfileRepository {
  getAchievements(): Promise<Achievement[]>;
  getFavorites(): Promise<Favorite[]>;
  getTeamMembers(): Promise<TeamMember[]>;
  getFaqList(): Promise<Faq[]>;
  getUserProfile(): Promise<any>;
}