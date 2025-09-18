import { collection, getDocs, limit, orderBy, query, startAfter, Timestamp, where } from 'firebase/firestore';
import { inject, injectable } from 'tsyringe';
import { AuthRepositoryToken } from '../../../../features/auth/auth.di';
import { IAuthRepository } from '../../../../features/auth/domain/repositories/IAuthRepository';
import { firestore } from '../../../../infrastructure/firebase/firebase.config';
import { Booking } from '../../domain/models/Booking';
import { IMyBookingsRepository } from '../../domain/repositories/IMyBookingsRepository';

@injectable()
export class MyBookingsRepository implements IMyBookingsRepository {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  async getUpcomingBookings(pageSize: number = 10, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }> {
    try {
      // Get current user ID
      const currentUser = await this.authRepository.getCurrentUser();
      const userId = currentUser?.id || '';

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Query for upcoming bookings
      let q = query(
        collection(firestore, 'bookings'),
        where('userId', '==', userId),
        where('endDate', '>=', new Date()),
        orderBy('endDate', 'asc'),
        limit(pageSize)
      );

      // If we have a last document, start after it (for pagination)
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      
      const bookings: Booking[] = [];
      let lastVisible = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lastVisible = doc;

        // Convert Firestore Timestamps to Date objects
        const startDate = data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate;
        const endDate = data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate;

        bookings.push({
          id: doc.id,
          vendor: data.vendor || "Tent'in Himalayas",
          tourName: data.tourName || 'Untitled Tour',
          tourImage: data.tourImage || '',
          startDate: startDate,
          endDate: endDate,
          status: data.status || 'confirmed',
          type: 'upcoming'
        });
      });

      return { bookings, lastDoc: lastVisible };
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      throw error;
    }
  }

  async getPastBookings(pageSize: number = 10, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }> {
    try {
      // Get current user ID
      const currentUser = await this.authRepository.getCurrentUser();
      const userId = currentUser?.id || '';

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Query for past bookings
      let q = query(
        collection(firestore, 'bookings'),
        where('userId', '==', userId),
        where('endDate', '<', new Date()),
        orderBy('endDate', 'desc'),
        limit(pageSize)
      );

      // If we have a last document, start after it (for pagination)
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      
      const bookings: Booking[] = [];
      let lastVisible = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lastVisible = doc;

        // Convert Firestore Timestamps to Date objects
        const startDate = data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate;
        const endDate = data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate;

        bookings.push({
          id: doc.id,
          vendor: data.vendor || "Tent'in Himalayas",
          tourName: data.tourName || 'Untitled Tour',
          tourImage: data.tourImage || '',
          startDate: startDate,
          endDate: endDate,
          status: data.status || 'confirmed',
          type: 'past'
        });
      });

      return { bookings, lastDoc: lastVisible };
    } catch (error) {
      console.error('Error fetching past bookings:', error);
      throw error;
    }
  }
}