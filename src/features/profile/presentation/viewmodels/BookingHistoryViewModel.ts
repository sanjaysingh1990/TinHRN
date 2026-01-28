import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { Booking } from '../../../mybookings/domain/models/Booking';
import { GetAllBookingsOrderedByCreatedAtUseCase } from '../../../mybookings/domain/usecases/GetAllBookingsOrderedByCreatedAtUseCase';
import { GetAllBookingsOrderedByCreatedAtUseCaseToken } from '../../../mybookings/mybookings.di';

@injectable()
export class BookingHistoryViewModel extends BaseViewModel {
  private _bookings: Booking[] = [];
  private _isLoading = false;

  constructor(
    @inject(GetAllBookingsOrderedByCreatedAtUseCaseToken) private getAllBookingsOrderedByCreatedAtUseCase: GetAllBookingsOrderedByCreatedAtUseCase
  ) {
    super();
  }

  get bookings(): Booking[] {
    return this._bookings;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async loadBookings(): Promise<void> {
    this._isLoading = true;
    this.notifyUpdate();

    try {
      this._bookings = await this.getAllBookingsOrderedByCreatedAtUseCase.execute();
    } catch (error) {
      console.error('BookingHistoryViewModel: Error loading bookings:', error);
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  // Deprecated compatibility methods
  async getAllBookings(): Promise<Booking[]> {
    return this.getAllBookingsOrderedByCreatedAtUseCase.execute();
  }
}