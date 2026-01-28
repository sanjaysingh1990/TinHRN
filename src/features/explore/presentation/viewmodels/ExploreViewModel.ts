import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { ExploreData } from '../../domain/entities/Explore';
import { IExploreRepository } from '../../domain/repositories/IExploreRepository';
import { ExploreRepositoryToken } from '../../explore.di';

@injectable()
export class ExploreViewModel extends BaseViewModel {
  private _exploreData: ExploreData = {
    categories: [],
    popularDestinations: [],
    topTreks: []
  };
  private _isLoading = true;

  constructor(
    @inject(ExploreRepositoryToken) private exploreRepository: IExploreRepository
  ) {
    super();
  }

  get exploreData(): ExploreData {
    return this._exploreData;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async loadExploreData(): Promise<void> {
    try {
      this._isLoading = true;
      this.notifyUpdate();

      const data = await this.exploreRepository.getExploreData();
      this._exploreData = data;
    } catch (error) {
      console.error('Error fetching explore data:', error);
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  async getExploreData(): Promise<ExploreData> {
    await this.loadExploreData();
    return this.exploreData;
  }
}