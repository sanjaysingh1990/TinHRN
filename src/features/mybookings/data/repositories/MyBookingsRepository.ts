
import { injectable } from 'tsyringe';
import { Booking } from '../../domain/models/Booking';
import { IMyBookingsRepository } from '../../domain/repositories/IMyBookingsRepository';

const dummyBookings = {
  upcoming: [
    {
      id: 1,
      vendor: "Tent'in Himalayas",
      title: "Cozy Cabin Retreat",
      dateRange: "Dec 15 - 18, 2024",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      type: "upcoming" as const,
    },
  ],
  past: [
    {
      id: 2,
      vendor: "Tent'in Himalayas",
      title: "Mountain View Tent",
      dateRange: "Nov 20 - 22, 2023",
      imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      type: "past" as const,
    },
  ],
};

@injectable()
export class MyBookingsRepository implements IMyBookingsRepository {
  async getUpcomingBookings(): Promise<Booking[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyBookings.upcoming);
      }, 3000);
    });
  }

  async getPastBookings(): Promise<Booking[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyBookings.past);
      }, 3000);
    });
  }
}
