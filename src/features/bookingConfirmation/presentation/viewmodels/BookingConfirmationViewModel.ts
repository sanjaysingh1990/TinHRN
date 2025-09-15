import { inject, injectable } from 'tsyringe';
import { BookingConfirmation, TourDetailsRepository } from '../../../tour-details/data/repositories/TourDetailsRepository';
import { TourDetailsRepositoryToken } from '../../../tour-details/tour-details.di';

@injectable()
export class BookingConfirmationViewModel {
  constructor(
    @inject(TourDetailsRepositoryToken) private tourRepository: TourDetailsRepository
  ) {}

  async confirmBooking(tourId: string): Promise<BookingConfirmation> {
    try {
      return await this.tourRepository.confirmBooking(tourId);
    } catch (error) {
      throw new Error('Failed to confirm booking');
    }
  }

  async getBookingDetails(bookingId: string): Promise<BookingConfirmation> {
    try {
      return await this.tourRepository.getBookingDetails(bookingId);
    } catch (error) {
      throw new Error('Failed to fetch booking details');
    }
  }
}