import { collection, getDocs, query, where, orderBy, limit, startAfter, Timestamp } from 'firebase/firestore';
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
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt;
        const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt;

        bookings.push({
          id: doc.id,
          userId: data.userId || '',
          tourId: data.tourId || '',
          tourName: data.tourName || 'Untitled Tour',
          tourImage: data.tourImage || '',
          bookingReference: data.bookingReference || '',
          startDate: startDate,
          endDate: endDate,
          duration: data.duration || 0,
          status: data.status || 'confirmed',
          totalAmount: data.totalAmount || 0,
          currency: data.currency || 'USD',
          packageType: data.packageType || 'standard',
          travelers: data.travelers || 1,
          createdAt: createdAt,
          updatedAt: updatedAt,
          vendor: data.vendor || "Tent'in Himalayas",
          payment: {
            method: data.payment?.method || 'credit_card',
            status: data.payment?.status || 'completed',
            transactionId: data.payment?.transactionId || ''
          },
          customisation: {
            tentType: {
              type: data.customisation?.tentType?.type || '',
              price: data.customisation?.tentType?.price || 0
            },
            addons: data.customisation?.addons?.map((addon: any) => ({
              addonName: addon.addonName || '',
              addonDescription: addon.addonDescription || '',
              addOnPrice: addon.addOnPrice || 0
            })) || []
          },
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
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt;
        const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt;

        bookings.push({
          id: doc.id,
          userId: data.userId || '',
          tourId: data.tourId || '',
          tourName: data.tourName || 'Untitled Tour',
          tourImage: data.tourImage || '',
          bookingReference: data.bookingReference || '',
          startDate: startDate,
          endDate: endDate,
          duration: data.duration || 0,
          status: data.status || 'confirmed',
          totalAmount: data.totalAmount || 0,
          currency: data.currency || 'USD',
          packageType: data.packageType || 'standard',
          travelers: data.travelers || 1,
          createdAt: createdAt,
          updatedAt: updatedAt,
          vendor: data.vendor || "Tent'in Himalayas",
          payment: {
            method: data.payment?.method || 'credit_card',
            status: data.payment?.status || 'completed',
            transactionId: data.payment?.transactionId || ''
          },
          customisation: {
            tentType: {
              type: data.customisation?.tentType?.type || '',
              price: data.customisation?.tentType?.price || 0
            },
            addons: data.customisation?.addons?.map((addon: any) => ({
              addonName: addon.addonName || '',
              addonDescription: addon.addonDescription || '',
              addOnPrice: addon.addOnPrice || 0
            })) || []
          },
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