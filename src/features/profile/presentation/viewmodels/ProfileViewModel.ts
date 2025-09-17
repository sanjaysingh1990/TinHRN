import { inject, injectable } from 'tsyringe';
import { Achievement } from '../../domain/models/Achievement';
import { Favorite } from '../../domain/models/Favorite';
import { GetAchievementsUseCase } from '../../domain/usecases/GetAchievementsUseCase';
import { GetFavoritesUseCase } from '../../domain/usecases/GetFavoritesUseCase';
import { GetUserProfileUseCase } from '../../domain/usecases/GetUserProfileUseCase';
import { GetAchievementsUseCaseToken, GetFavoritesUseCaseToken, GetUserProfileUseCaseToken } from '../../profile.di';

@injectable()
export class ProfileViewModel {
  constructor(
    @inject(GetAchievementsUseCaseToken) private getAchievementsUseCase: GetAchievementsUseCase,
    @inject(GetFavoritesUseCaseToken) private getFavoritesUseCase: GetFavoritesUseCase,
    @inject(GetUserProfileUseCaseToken) private getUserProfileUseCase: GetUserProfileUseCase
  ) {}

  async getAchievements(): Promise<Achievement[]> {
    return this.getAchievementsUseCase.execute();
  }

  async getFavorites(): Promise<Favorite[]> {
    return this.getFavoritesUseCase.execute();
  }

  async getUserProfile(): Promise<any> {
    return this.getUserProfileUseCase.execute();
  }
}