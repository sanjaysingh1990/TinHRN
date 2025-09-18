import { inject, injectable } from 'tsyringe';
import { MyBookingsRepositoryToken } from '../../mybookings.di';
import { Booking } from '../models/Booking';
import { IMyBookingsRepository } from '../repositories/IMyBookingsRepository';

@injectable()
export class GetUpcomingBookingsUseCase {
  constructor(
    @inject(MyBookingsRepositoryToken) private myBookingsRepository: IMyBookingsRepository
  ) {}

  async execute(pageSize?: number, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }> {
    return await this.myBookingsRepository.getUpcomingBookings(pageSize, lastDoc);
  }
}