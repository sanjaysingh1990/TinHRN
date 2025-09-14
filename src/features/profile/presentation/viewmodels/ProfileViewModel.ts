
import { injectable, inject } from 'tsyringe';
import { GetAchievementsUseCase } from '../../domain/usecases/GetAchievementsUseCase';
import { GetFavoritesUseCase } from '../../domain/usecases/GetFavoritesUseCase';
import { GetAchievementsUseCaseToken, GetFavoritesUseCaseToken } from '../../profile.di';
import { Achievement } from '../../domain/models/Achievement';
import { Favorite } from '../../domain/models/Favorite';

@injectable()
export class ProfileViewModel {
  constructor(
    @inject(GetAchievementsUseCaseToken) private getAchievementsUseCase: GetAchievementsUseCase,
    @inject(GetFavoritesUseCaseToken) private getFavoritesUseCase: GetFavoritesUseCase
  ) {}

  async getAchievements(): Promise<Achievement[]> {
    return this.getAchievementsUseCase.execute();
  }

  async getFavorites(): Promise<Favorite[]> {
    return this.getFavoritesUseCase.execute();
  }
}
