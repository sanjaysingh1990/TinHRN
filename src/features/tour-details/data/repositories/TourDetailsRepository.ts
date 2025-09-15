
import { injectable } from 'tsyringe';
import { TourDetails } from '../../domain/entities/TourDetails';
import { ITourDetailsRepository } from '../../domain/repositories/ITourDetailsRepository';

export interface BookingConfirmation {
  tourName: string;
  bookingReference: string;
  date: string;
  duration: string;
  totalAmount: string;
}

const dummyDetails: TourDetails = {
  overview:
    'The Annapurna Base Camp trek is one of the most popular treks in the Annapurna region. The trail goes alongside terraced rice paddies, lush rhododendron forests, and high altitude landscapes with the Annapurna Range in view most of the time.',
  itinerary: [
    { day: '01', title: 'Arrival in Kathmandu', icon: 'terrain' },
    { day: '02', title: 'Drive to Pokhara', icon: 'terrain' },
    { day: '03', title: 'Trek to Ghandruk', icon: 'terrain' },
    { day: '04', title: 'Trek to Chhomrong', icon: 'terrain' },
  ],
  pricing: {
    standard: '$1,200 / person',
    premium: '$1,800 / person',
  },
  reviews: [
    {
      id: '1',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Jane Doe',
      date: '2 weeks ago',
      rating: 5,
      review:
        'An absolutely breathtaking experience! The views were surreal and the guide was fantastic. Highly recommend this to anyone looking for an adventure.',
    },
    {
      id: '2',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'John Smith',
      date: '1 month ago',
      rating: 4,
      review:
        'A well-organized trek. The itinerary was perfectly paced. The only downside was the weather on one of the days, but that’s beyond anyone’s control.',
    },
  ],
};

@injectable()
export class TourDetailsRepository implements ITourDetailsRepository {
  async getTourDetails(tourId: string): Promise<TourDetails> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyDetails);
      }, 5000);
    });
  }

  async bookTour(tourId: string): Promise<{ bookingId: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const bookingId = 'BKG-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        resolve({ bookingId });
      }, 3000); // 3 seconds delay as requested
    });
  }

  async getBookingDetails(bookingId: string): Promise<BookingConfirmation> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          tourName: 'Annapurna Base Camp Trek',
          bookingReference: bookingId,
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          duration: '14 Days',
          totalAmount: '$1,200'
        });
      }, 2000); // 2s delay for fetching booking details
    });
  }

  async confirmBooking(tourId: string): Promise<BookingConfirmation> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          tourName: 'Annapurna Base Camp Trek',
          bookingReference: 'THB-2024-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          duration: '14 Days',
          totalAmount: '$1,200'
        });
      }, 2000); // 2s delay as requested
    });
  }
}
