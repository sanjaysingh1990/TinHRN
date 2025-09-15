
import { BookingConfirmation } from '../../data/repositories/TourDetailsRepository';
import { TourDetails } from '../entities/TourDetails';

export interface ITourDetailsRepository {
  getTourDetails(tourId: string): Promise<TourDetails>;
  bookTour(tourId: string): Promise<{ bookingId: string }>;
  getBookingDetails(bookingId: string): Promise<BookingConfirmation>;
}
