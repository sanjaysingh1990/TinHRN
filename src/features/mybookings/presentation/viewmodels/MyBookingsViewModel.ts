
import { injectable, inject } from 'tsyringe';
import { GetUpcomingBookingsUseCase } from '../../domain/usecases/GetUpcomingBookingsUseCase';
import { GetPastBookingsUseCase } from '../../domain/usecases/GetPastBookingsUseCase';
import { GetUpcomingBookingsUseCaseToken, GetPastBookingsUseCaseToken } from '../../mybookings.di';
import { Booking } from '../../domain/models/Booking';

@injectable()
export class MyBookingsViewModel {
  constructor(
    @inject(GetUpcomingBookingsUseCaseToken) private getUpcomingBookingsUseCase: GetUpcomingBookingsUseCase,
    @inject(GetPastBookingsUseCaseToken) private getPastBookingsUseCase: GetPastBookingsUseCase
  ) {}

  async getUpcomingBookings(): Promise<Booking[]> {
    return this.getUpcomingBookingsUseCase.execute();
  }

  async getPastBookings(): Promise<Booking[]> {
    return this.getPastBookingsUseCase.execute();
  }
}
