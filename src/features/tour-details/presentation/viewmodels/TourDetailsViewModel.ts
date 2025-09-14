
import { injectable, inject } from 'tsyringe';
import { TourDetails } from '../../domain/entities/TourDetails';
import { ITourDetailsRepository } from '../../domain/repositories/ITourDetailsRepository';
import { TourDetailsRepositoryToken } from '../../tour-details.di';

@injectable()
export class TourDetailsViewModel {
  constructor(
    @inject(TourDetailsRepositoryToken) private tourDetailsRepository: ITourDetailsRepository
  ) {}

  async getTourDetails(tourId: string): Promise<TourDetails> {
    return this.tourDetailsRepository.getTourDetails(tourId);
  }
}
