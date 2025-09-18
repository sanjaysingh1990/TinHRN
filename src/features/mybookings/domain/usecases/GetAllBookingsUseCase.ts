import { inject, injectable } from 'tsyringe';
import { MyBookingsRepositoryToken } from '../../mybookings.di';
import { Booking } from '../models/Booking';
import { IMyBookingsRepository } from '../repositories/IMyBookingsRepository';

@injectable()
export class GetAllBookingsUseCase {
  constructor(
    @inject(MyBookingsRepositoryToken) private myBookingsRepository: IMyBookingsRepository
  ) {}

  async execute(): Promise<{ upcoming: Booking[]; past: Booking[] }> {
    // Fetch both upcoming and past bookings (10 items each for initial load)
    const [upcomingResult, pastResult] = await Promise.all([
      this.myBookingsRepository.getUpcomingBookings(10),
      this.myBookingsRepository.getPastBookings(10)
    ]);

    return {
      upcoming: upcomingResult.bookings,
      past: pastResult.bookings
    };
  }
}