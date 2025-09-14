
import { injectable, inject } from 'tsyringe';
import { Tour } from '../../domain/entities/Tour';
import { ITourRepository } from '../../domain/repositories/ITourRepository';
import { TourRepositoryToken } from '../../home.di';

@injectable()
export class HomeViewModel {
  constructor(
    @inject(TourRepositoryToken) private tourRepository: ITourRepository
  ) {}

  async getHotTours(): Promise<Tour[]> {
    return this.tourRepository.getHotTours();
  }
}
