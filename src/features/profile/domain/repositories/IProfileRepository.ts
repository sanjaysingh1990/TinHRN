import { Achievement } from '../models/Achievement';
import { Faq } from '../models/Faq';
import { Favorite } from '../models/Favorite';
import { TeamMember } from '../models/TeamMember';
import { AboutUs } from '../models/AboutUs';

export interface IProfileRepository {
  getAchievements(): Promise<Achievement[]>;
  getFavorites(): Promise<Favorite[]>;
  getTeamMembers(): Promise<TeamMember[]>;
  getFaqList(): Promise<Faq[]>;
  getUserProfile(): Promise<any>;
  getAboutUsData(): Promise<AboutUs>;
}