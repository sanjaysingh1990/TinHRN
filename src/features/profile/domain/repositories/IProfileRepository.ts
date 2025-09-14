
import { Achievement } from '../models/Achievement';
import { Favorite } from '../models/Favorite';

export interface IProfileRepository {
  getAchievements(): Promise<Achievement[]>;
  getFavorites(): Promise<Favorite[]>;
}
