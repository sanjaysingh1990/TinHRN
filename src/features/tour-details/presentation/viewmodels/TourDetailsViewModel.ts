import { inject, injectable } from 'tsyringe';
import { IMyBookingsRepository } from '../../../../features/mybookings/domain/repositories/IMyBookingsRepository';
import { MyBookingsRepositoryToken } from '../../../../features/mybookings/mybookings.di';
import { BookingConfirmation } from '../../data/repositories/TourDetailsRepository';
import { TourDetails } from '../../domain/entities/TourDetails';
import { ITourDetailsRepository } from '../../domain/repositories/ITourDetailsRepository';
import { TourDetailsRepositoryToken } from '../../tour-details.di';

@injectable()
export class TourDetailsViewModel {
  constructor(
    @inject(TourDetailsRepositoryToken) private tourDetailsRepository: ITourDetailsRepository,
    @inject(MyBookingsRepositoryToken) private myBookingsRepository: IMyBookingsRepository
  ) { }

  async getTourDetails(tourId: string): Promise<TourDetails> {
    return this.tourDetailsRepository.getTourDetails(tourId);
  }

  async getTourReviews(tourId: string, limit: number, startAfter?: any): Promise<any[]> {
    return this.tourDetailsRepository.getTourReviews(tourId, limit, startAfter);
  }

  async bookTour(tourId: string): Promise<{ bookingId: string }> {
    return this.tourDetailsRepository.bookTour(tourId);
  }

  async getBookingDetails(bookingId: string): Promise<BookingConfirmation> {
    return this.tourDetailsRepository.getBookingDetails(bookingId);
  }


  async cancelBooking(bookingId: string): Promise<void> {
    return this.myBookingsRepository.cancelBooking(bookingId);
  }
}