
import { injectable } from 'tsyringe';
import { Achievement } from '../../domain/models/Achievement';
import { Favorite } from '../../domain/models/Favorite';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';

const dummyAchievements: Achievement[] = [
  { id: 1, title: 'First Trek', icon: 'hiking', color: 'yellow' },
  { id: 2, title: 'Campfire Pro', icon: 'local_fire_department', color: 'orange' },
  { id: 3, title: 'Peak Bagger', icon: 'area_chart', color: 'cyan' },
  { id: 4, title: 'Photo Master', icon: 'photo_camera', color: 'gray', locked: true },
];

const dummyFavorites: Favorite[] = [
  {
    id: 1,
    title: 'Valley of Flowers',
    location: 'Uttarakhand, India',
    imageUrl: 'https://images.unsplash.com/photo-1542395975-16a58c6b68f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    title: 'Tawang Monastery',
    location: 'Arunachal Pradesh, India',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

@injectable()
export class ProfileRepository implements IProfileRepository {
  async getAchievements(): Promise<Achievement[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyAchievements);
      }, 5000);
    });
  }

  async getFavorites(): Promise<Favorite[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyFavorites);
      }, 5000);
    });
  }
}
