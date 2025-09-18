import { Booking } from '../models/Booking';

export interface IMyBookingsRepository {
  getUpcomingBookings(pageSize?: number, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }>;
  getPastBookings(pageSize?: number, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }>;
  getAllBookingsOrderedByCreatedAt(): Promise<Booking[]>;
}