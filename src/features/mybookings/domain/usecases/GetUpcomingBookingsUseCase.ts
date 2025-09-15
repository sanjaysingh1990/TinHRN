
import { injectable, inject } from 'tsyringe';
import { IMyBookingsRepository } from '../repositories/IMyBookingsRepository';
import { MyBookingsRepositoryToken } from '../../mybookings.di';
import { Booking } from '../models/Booking';

@injectable()
export class GetUpcomingBookingsUseCase {
  constructor(
    @inject(MyBookingsRepositoryToken) private myBookingsRepository: IMyBookingsRepository
  ) {}

  execute(): Promise<Booking[]> {
    return this.myBookingsRepository.getUpcomingBookings();
  }
}
