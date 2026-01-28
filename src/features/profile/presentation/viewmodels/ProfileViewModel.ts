import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { Achievement } from '../../domain/models/Achievement';
import { Favorite } from '../../domain/models/Favorite';
import { GetAchievementsUseCase } from '../../domain/usecases/GetAchievementsUseCase';
import { GetFavoritesUseCase } from '../../domain/usecases/GetFavoritesUseCase';
import { GetUserProfileUseCase } from '../../domain/usecases/GetUserProfileUseCase';
import { GetAchievementsUseCaseToken, GetFavoritesUseCaseToken, GetUserProfileUseCaseToken } from '../../profile.di';

@injectable()
export class ProfileViewModel extends BaseViewModel {
  private _profile: any = null;
  private _achievements: Achievement[] = [];
  private _favorites: Favorite[] = [];
  private _isLoading = false;

  constructor(
    @inject(GetAchievementsUseCaseToken) private getAchievementsUseCase: GetAchievementsUseCase,
    @inject(GetFavoritesUseCaseToken) private getFavoritesUseCase: GetFavoritesUseCase,
    @inject(GetUserProfileUseCaseToken) private getUserProfileUseCase: GetUserProfileUseCase
  ) {
    super();
  }

  get profile(): any {
    return this._profile;
  }

  get achievements(): Achievement[] {
    return this._achievements;
  }

  get favorites(): Favorite[] {
    return this._favorites;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async loadProfileData(): Promise<void> {
    this._isLoading = true;
    this.notifyUpdate();

    try {
      const [profile, achievements, favorites] = await Promise.all([
        this.getUserProfileUseCase.execute(),
        this.getAchievementsUseCase.execute(),
        this.getFavoritesUseCase.execute()
      ]);

      this._profile = profile;
      this._achievements = achievements;
      this._favorites = favorites;
    } catch (error) {
      console.error('ProfileViewModel: Error loading data:', error);
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  // Deprecated compatibility methods
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