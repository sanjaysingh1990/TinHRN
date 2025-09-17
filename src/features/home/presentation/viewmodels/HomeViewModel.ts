import { injectable, inject } from 'tsyringe';
import { Tour } from '../../domain/entities/Tour';
import { ITourRepository } from '../../domain/repositories/ITourRepository';
import { TourRepositoryToken } from '../../home.di';

@injectable()
export class HomeViewModel {
  constructor(
    @inject(TourRepositoryToken) private tourRepository: ITourRepository
  ) {
    console.log('HomeViewModel instance created');
  }

  async getHotTours(): Promise<Tour[]> {
    return this.tourRepository.getHotTours();
  }

  async getHotToursPaginated(page: number, limit: number): Promise<Tour[]> {
    console.log(`HomeViewModel: Requesting page ${page} with limit ${limit}`);
    const result = await this.tourRepository.getHotToursPaginated(page, limit);
    console.log(`HomeViewModel: Received ${result.length} tours for page ${page}`);
    return result;
  }

  async searchTours(query: string): Promise<Tour[]> {
    return this.tourRepository.searchTours(query);
  }
}