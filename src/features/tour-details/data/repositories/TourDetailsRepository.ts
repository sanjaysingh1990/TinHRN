import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { injectable } from 'tsyringe';
import { firestore } from '../../../../infrastructure/firebase/firebase.config';
import { TourDetails } from '../../domain/entities/TourDetails';
import { ITourDetailsRepository } from '../../domain/repositories/ITourDetailsRepository';

export interface BookingConfirmation {
  tourName: string;
  bookingReference: string;
  date: string;
  duration: string;
  totalAmount: string;
}

@injectable()
export class TourDetailsRepository implements ITourDetailsRepository {
  async getTourDetails(tourId: string): Promise<TourDetails> {
    try {
      // Fetch tour details from Firestore
      const tourDoc = await getDoc(doc(firestore, 'tours', tourId));
      
      if (!tourDoc.exists()) {
        throw new Error('Tour not found');
      }
      
      const tourData = tourDoc.data();
      
      // Fetch latest 5 reviews from Firestore
      const reviewsCollection = collection(firestore, `tours/${tourId}/reviews`);
      const reviewsQuery = query(reviewsCollection, orderBy('createdAt', 'desc'), limit(5));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      const reviews = reviewsSnapshot.docs.map(reviewDoc => {
        const reviewData = reviewDoc.data();
        return {
          id: reviewDoc.id,
          avatar: reviewData.userPhotoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
          name: reviewData.userName || 'Anonymous',
          date: reviewData.createdAt ? new Date(reviewData.createdAt._seconds * 1000).toLocaleDateString() : 'Unknown date',
          rating: reviewData.rating || 0,
          review: reviewData.review || ''
        };
      });
      
      // Process itinerary data
      const itinerary = tourData.itinerary ? tourData.itinerary.map((item: any, index: number) => ({
        day: item.day?.toString() || (index + 1).toString(),
        title: item.activity || item.title || `Day ${index + 1}`,
        icon: 'terrain',
        location: item.location || '',
        activity: item.activity || '',
        accommodation: item.accommodation || '',
        transport: item.transport || '',
        distance: item.distance || '',
        duration: item.duration || ''
      })) : [];
      
      // Format pricing
      const pricing = {
        standard: tourData.price?.standard ? `$${tourData.price.standard.toLocaleString()} / person` : '$0 / person',
        premium: tourData.price?.premium ? `$${tourData.price.premium.toLocaleString()} / person` : '$0 / person'
      };
      
      return {
        id: tourDoc.id,
        name: tourData.name || '',
        overview: tourData.description || '',
        itinerary,
        pricing,
        reviews,
        highlights: tourData.highlights || [],
        includes: tourData.includes || [],
        excludes: tourData.excludes || [],
        image: tourData.image || '',
        duration: tourData.duration || '',
        difficulty: tourData.difficulty || '',
        altitude: tourData.altitude || '',
        location: {
          country: tourData.location?.country || '',
          region: tourData.location?.region || ''
        }
      };
    } catch (error) {
      console.error('Error fetching tour details from Firebase:', error);
      throw error;
    }
  }

  async getTourReviews(tourId: string, limitCount: number, startAfterDoc?: any): Promise<any[]> {
    try {
      const reviewsCollection = collection(firestore, `tours/${tourId}/reviews`);
      let reviewsQuery;
      
      if (startAfterDoc) {
        reviewsQuery = query(
          reviewsCollection, 
          orderBy('createdAt', 'desc'), 
          startAfter(startAfterDoc), 
          limit(limitCount)
        );
      } else {
        reviewsQuery = query(
          reviewsCollection, 
          orderBy('createdAt', 'desc'), 
          limit(limitCount)
        );
      }
      
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      const reviews = reviewsSnapshot.docs.map(reviewDoc => {
        const reviewData = reviewDoc.data();
        return {
          id: reviewDoc.id,
          avatar: reviewData.userPhotoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
          name: reviewData.userName || 'Anonymous',
          date: reviewData.createdAt ? new Date(reviewData.createdAt._seconds * 1000).toLocaleDateString() : 'Unknown date',
          rating: reviewData.rating || 0,
          review: reviewData.review || '',
          doc: reviewDoc // Include the document for pagination
        };
      });
      
      return reviews;
    } catch (error) {
      console.error('Error fetching tour reviews from Firebase:', error);
      throw error;
    }
  }

  async bookTour(tourId: string): Promise<{ bookingId: string }> {
    // Generate a booking ID without artificial delay
    const bookingId = 'BKG-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    return { bookingId };
  }

  async getBookingDetails(bookingId: string): Promise<BookingConfirmation> {
    // Return booking details without artificial delay
    return {
      tourName: 'Annapurna Base Camp Trek',
      bookingReference: bookingId,
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      duration: '14 Days',
      totalAmount: '$1,200'
    };
  }

  async confirmBooking(tourId: string): Promise<BookingConfirmation> {
    // Return confirmation without artificial delay
    return {
      tourName: 'Annapurna Base Camp Trek',
      bookingReference: 'THB-2024-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      duration: '14 Days',
      totalAmount: '$1,200'
    };
  }
}