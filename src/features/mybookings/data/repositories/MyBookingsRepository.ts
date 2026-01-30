import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, Timestamp, updateDoc, where } from 'firebase/firestore';
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
  ) { }

  async getUpcomingBookings(pageSize: number = 5, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }> {
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
          tourId: data.tourId || '',
          bookingReference: data.bookingReference || '',
          vendor: data.vendor || "Tent'in Himalayas",
          tourName: data.tourName || 'Untitled Tour',
          tourImage: data.tourImage || '',
          startDate: startDate,
          endDate: endDate,
          status: data.status || 'confirmed',
          type: 'upcoming',
          totalPrice: data.totalAmount,
          customization: data.customisation
        });
      });

      return { bookings, lastDoc: lastVisible };
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      throw error;
    }
  }

  async getPastBookings(pageSize: number = 5, lastDoc?: any): Promise<{ bookings: Booking[]; lastDoc?: any }> {
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
          tourId: data.tourId || '',
          bookingReference: data.bookingReference || '',
          vendor: data.vendor || "Tent'in Himalayas",
          tourName: data.tourName || 'Untitled Tour',
          tourImage: data.tourImage || '',
          startDate: startDate,
          endDate: endDate,
          status: data.status || 'confirmed',
          type: 'past',
          totalPrice: data.totalAmount,
          customization: data.customisation
        });
      });

      return { bookings, lastDoc: lastVisible };
    } catch (error) {
      console.error('Error fetching past bookings:', error);
      throw error;
    }
  }

  async getAllBookingsOrderedByCreatedAt(): Promise<Booking[]> {
    try {
      // Get current user ID
      const currentUser = await this.authRepository.getCurrentUser();
      const userId = currentUser?.id || '';

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Query for all bookings ordered by createdAt
      const q = query(
        collection(firestore, 'bookings'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const bookings: Booking[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Convert Firestore Timestamps to Date objects
        const startDate = data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate;
        const endDate = data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate;
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt;

        // Determine if booking is upcoming or past
        const type = endDate >= new Date() ? 'upcoming' : 'past';

        bookings.push({
          id: doc.id,
          tourId: data.tourId || '',
          bookingReference: data.bookingReference || '',
          vendor: data.vendor || "Tent'in Himalayas",
          tourName: data.tourName || 'Untitled Tour',
          tourImage: data.tourImage || '',
          startDate: startDate,
          endDate: endDate,
          status: data.status || 'confirmed',
          type: type,
          totalPrice: data.totalAmount,
          customization: data.customisation
        });
      });

      return bookings;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }


  async cancelBooking(bookingId: string): Promise<void> {
    try {
      // Get current user ID
      const currentUser = await this.authRepository.getCurrentUser();
      if (!currentUser) throw new Error('User not authenticated');

      const bookingRef = doc(firestore, 'bookings', bookingId);

      // Update status to 'cancelled'
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
      });

    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const currentUser = await this.authRepository.getCurrentUser();
      if (!currentUser) throw new Error('User not authenticated');

      const docRef = doc(firestore, 'bookings', bookingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const startDate = data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate;
        const endDate = data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate;
        const type = endDate >= new Date() ? 'upcoming' : 'past';

        return {
          id: docSnap.id,
          tourId: data.tourId || '',
          bookingReference: data.bookingReference || '',
          vendor: data.vendor || "Tent'in Himalayas",
          tourName: data.tourName || 'Untitled Tour',
          tourImage: data.tourImage || '',
          startDate: startDate,
          endDate: endDate,
          status: data.status || 'confirmed',
          type: type,
          totalPrice: data.totalAmount,
          customization: data.customisation
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  }
}