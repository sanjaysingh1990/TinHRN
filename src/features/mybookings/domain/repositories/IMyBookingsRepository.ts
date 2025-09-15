
import { Booking } from '../models/Booking';

export interface IMyBookingsRepository {
  getUpcomingBookings(): Promise<Booking[]>;
  getPastBookings(): Promise<Booking[]>;
}
