import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { Booking } from '../../domain/models/Booking';
import { GetAllBookingsUseCase } from '../../domain/usecases/GetAllBookingsUseCase';
import { GetPastBookingsUseCase } from '../../domain/usecases/GetPastBookingsUseCase';
import { GetUpcomingBookingsUseCase } from '../../domain/usecases/GetUpcomingBookingsUseCase';
import { GetAllBookingsUseCaseToken, GetPastBookingsUseCaseToken, GetUpcomingBookingsUseCaseToken } from '../../mybookings.di';

@injectable()
export class MyBookingsViewModel extends BaseViewModel {
  private _upcomingBookings: Booking[] = [];
  private _pastBookings: Booking[] = [];
  private _isLoading = false;

  private _upcomingLastDoc: any = null;
  private _pastLastDoc: any = null;
  private _hasMoreUpcoming = true;
  private _hasMorePast = true;

  constructor(
    @inject(GetUpcomingBookingsUseCaseToken) private getUpcomingBookingsUseCase: GetUpcomingBookingsUseCase,
    @inject(GetPastBookingsUseCaseToken) private getPastBookingsUseCase: GetPastBookingsUseCase,
    @inject(GetAllBookingsUseCaseToken) private getAllBookingsUseCase: GetAllBookingsUseCase
  ) {
    super();
  }

  get upcomingBookings(): Booking[] {
    return this._upcomingBookings;
  }

  get pastBookings(): Booking[] {
    return this._pastBookings;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get hasMoreUpcoming(): boolean {
    return this._hasMoreUpcoming;
  }

  get hasMorePast(): boolean {
    return this._hasMorePast;
  }

  async loadBookings(): Promise<void> {
    this._isLoading = true;
    this.notifyUpdate();

    try {
      const [upcomingResult, pastResult] = await Promise.all([
        this.getUpcomingBookingsUseCase.execute(5),
        this.getPastBookingsUseCase.execute(5)
      ]);

      this._upcomingBookings = upcomingResult.bookings;
      this._upcomingLastDoc = upcomingResult.lastDoc;
      this._hasMoreUpcoming = upcomingResult.bookings.length === 5;

      this._pastBookings = pastResult.bookings;
      this._pastLastDoc = pastResult.lastDoc;
      this._hasMorePast = pastResult.bookings.length === 5;
    } catch (error) {
      console.error('MyBookingsViewModel: Error loading bookings:', error);
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  async loadMoreUpcoming(): Promise<void> {
    if (!this._hasMoreUpcoming || !this._upcomingLastDoc) return;

    try {
      const result = await this.getUpcomingBookingsUseCase.execute(5, this._upcomingLastDoc);
      this._upcomingBookings = [...this._upcomingBookings, ...result.bookings];
      this._upcomingLastDoc = result.lastDoc;
      this._hasMoreUpcoming = result.bookings.length === 5;
    } catch (error) {
      console.error('MyBookingsViewModel: Error loading more upcoming:', error);
    } finally {
      this.notifyUpdate();
    }
  }

  async loadMorePast(): Promise<void> {
    if (!this._hasMorePast || !this._pastLastDoc) return;

    try {
      const result = await this.getPastBookingsUseCase.execute(5, this._pastLastDoc);
      this._pastBookings = [...this._pastBookings, ...result.bookings];
      this._pastLastDoc = result.lastDoc;
      this._hasMorePast = result.bookings.length === 5;
    } catch (error) {
      console.error('MyBookingsViewModel: Error loading more past:', error);
    } finally {
      this.notifyUpdate();
    }
  }

  // Deprecated compatibility methods
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