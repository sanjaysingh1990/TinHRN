import { inject, injectable } from 'tsyringe';
import { Booking } from '../../../mybookings/domain/models/Booking';
import { GetAllBookingsOrderedByCreatedAtUseCase } from '../../../mybookings/domain/usecases/GetAllBookingsOrderedByCreatedAtUseCase';
import { GetAllBookingsOrderedByCreatedAtUseCaseToken } from '../../../mybookings/mybookings.di';

@injectable()
export class BookingHistoryViewModel {
  constructor(
    @inject(GetAllBookingsOrderedByCreatedAtUseCaseToken) private getAllBookingsOrderedByCreatedAtUseCase: GetAllBookingsOrderedByCreatedAtUseCase
  ) {}

  async getAllBookings(): Promise<Booking[]> {
    return this.getAllBookingsOrderedByCreatedAtUseCase.execute();
  }
}