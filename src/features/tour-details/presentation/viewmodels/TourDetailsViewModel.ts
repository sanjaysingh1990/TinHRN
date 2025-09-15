
import { inject, injectable } from 'tsyringe';
import { BookingConfirmation } from '../../data/repositories/TourDetailsRepository';
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

  async bookTour(tourId: string): Promise<{ bookingId: string }> {
    return this.tourDetailsRepository.bookTour(tourId);
  }

  async getBookingDetails(bookingId: string): Promise<BookingConfirmation> {
    return this.tourDetailsRepository.getBookingDetails(bookingId);
  }
}
