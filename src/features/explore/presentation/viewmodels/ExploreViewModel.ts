import { inject, injectable } from 'tsyringe';
import { ExploreData } from '../../domain/entities/Explore';
import { IExploreRepository } from '../../domain/repositories/IExploreRepository';
import { ExploreRepositoryToken } from '../../explore.di';

@injectable()
export class ExploreViewModel {
  constructor(
    @inject(ExploreRepositoryToken) private exploreRepository: IExploreRepository
  ) {}

  async getExploreData(): Promise<ExploreData> {
    try {
      return await this.exploreRepository.getExploreData();
    } catch (error) {
      console.error('Error fetching explore data:', error);
      // Return empty data on error
      return {
        categories: [],
        popularDestinations: [],
        topTreks: []
      };
    }
  }
}