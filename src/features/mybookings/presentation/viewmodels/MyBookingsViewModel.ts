import { injectable, inject } from 'tsyringe';
import { GetUpcomingBookingsUseCase } from '../../domain/usecases/GetUpcomingBookingsUseCase';
import { GetPastBookingsUseCase } from '../../domain/usecases/GetPastBookingsUseCase';
import { GetAllBookingsUseCase } from '../../domain/usecases/GetAllBookingsUseCase';
import { GetUpcomingBookingsUseCaseToken, GetPastBookingsUseCaseToken, GetAllBookingsUseCaseToken } from '../../mybookings.di';
import { Booking } from '../../domain/models/Booking';

@injectable()
export class MyBookingsViewModel {
  constructor(
    @inject(GetUpcomingBookingsUseCaseToken) private getUpcomingBookingsUseCase: GetUpcomingBookingsUseCase,
    @inject(GetPastBookingsUseCaseToken) private getPastBookingsUseCase: GetPastBookingsUseCase,
    @inject(GetAllBookingsUseCaseToken) private getAllBookingsUseCase: GetAllBookingsUseCase
  ) {}

  async getUpcomingBookings(pageSize?: number, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }> {
    return await this.getUpcomingBookingsUseCase.execute(pageSize, lastDoc);
  }

  async getPastBookings(pageSize?: number, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }> {
    return await this.getPastBookingsUseCase.execute(pageSize, lastDoc);
  }

  async getAllBookings(): Promise<{ upcoming: Booking[]; past: Booking[] }> {
    return await this.getAllBookingsUseCase.execute();
  }
}