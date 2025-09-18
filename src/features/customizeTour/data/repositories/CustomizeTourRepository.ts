import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { injectable } from 'tsyringe';
import { firestore } from '../../../../infrastructure/firebase/firebase.config';
import {
    AddOn,
    CustomizationSelection,
    CustomizeTourData,
    SupportOption,
    TentOption
} from '../../domain/entities/CustomizeTour';
import { ICustomizeTourRepository } from '../../domain/repositories/ICustomizeTourRepository';

@injectable()
export class CustomizeTourRepository implements ICustomizeTourRepository {
  
  async getCustomizationData(): Promise<CustomizeTourData> {
    // Simulate 2-second API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      availableDates: this.generateAvailableDates(),
      tentOptions: this.getDummyTentOptions(),
      addOns: this.getDummyAddOns(),
      supportOptions: this.getSupportOptions()
    };
  }

  async saveCustomization(selection: CustomizationSelection): Promise<{ success: boolean; customizationId: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      customizationId: `custom_${Date.now()}`
    };
  }

  async bookTour(tourId: string, selection: CustomizationSelection): Promise<{ success: boolean; bookingId: string }> {
    try {
      // Create booking document in Firestore
      const bookingsCollection = collection(firestore, 'bookings');
      
      // Generate a unique booking reference
      const bookingReference = 'THB-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      
      // Calculate duration
      let duration = '1 Night';
      if (selection.startDate && selection.endDate) {
        const timeDiff = selection.endDate.getTime() - selection.startDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        duration = `${days} Days`;
      }
      
      // Calculate total amount
      let totalAmount = 0;
      let nights = 1;
      if (selection.startDate && selection.endDate) {
        const timeDiff = selection.endDate.getTime() - selection.startDate.getTime();
        nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        nights = Math.max(1, nights);
      }
      
      if (selection.selectedTent) {
        totalAmount += selection.selectedTent.pricePerNight * nights;
      }
      selection.selectedAddOns.forEach(addOn => {
        totalAmount += addOn.price;
      });
      
      // Create booking document
      const bookingDoc = await addDoc(bookingsCollection, {
        userId: 'current-user-id', // This should be replaced with actual user ID
        tourId: tourId,
        tourName: 'Tour Name', // This should be replaced with actual tour name
        bookingReference: bookingReference,
        startDate: selection.startDate || new Date(),
        endDate: selection.endDate || new Date(),
        duration: duration,
        status: 'confirmed',
        totalAmount: totalAmount,
        currency: 'USD',
        packageType: 'standard',
        travelers: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        payment: {
          method: 'credit_card',
          status: 'completed',
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 10)
        },
        customisation: {
          tentType: selection.selectedTent ? {
            type: selection.selectedTent.name,
            price: selection.selectedTent.pricePerNight
          } : {
            type: '',
            price: 0
          },
          addons: selection.selectedAddOns.map(addOn => ({
            addonName: addOn.name,
            addonDescription: addOn.description,
            addOnPrice: addOn.price
          }))
        }
      });
      
      return {
        success: true,
        bookingId: bookingDoc.id
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  private generateAvailableDates(): Date[] {
    const dates: Date[] = [];
    const today = new Date();
    
    // Generate 4-5 random future dates within next 30 days
    const randomCount = 4 + Math.floor(Math.random() * 2); // 4 or 5 dates
    const usedDays = new Set<number>();
    
    while (dates.length < randomCount) {
      const randomDay = 1 + Math.floor(Math.random() * 30); // 1-30 days from today
      
      if (!usedDays.has(randomDay)) {
        usedDays.add(randomDay);
        const date = new Date(today);
        date.setDate(today.getDate() + randomDay);
        dates.push(date);
      }
    }
    
    // Sort dates chronologically
    dates.sort((a, b) => a.getTime() - b.getTime());
    
    return dates;
  }

  private getDummyTentOptions(): TentOption[] {
    return [
      {
        id: 'basic-tent',
        name: 'Basic Tent',
        description: 'Comfortable 2-person tent with basic amenities',
        pricePerNight: 50,
        maxOccupancy: 2,
        features: ['Waterproof', 'Sleeping bags included', 'Basic lighting'],
        isSelected: false
      },
      {
        id: 'deluxe-tent',
        name: 'Deluxe Tent',
        description: 'Spacious tent with premium comfort features',
        pricePerNight: 85,
        maxOccupancy: 3,
        features: ['Waterproof', 'Premium bedding', 'Solar charging', 'Private bathroom access'],
        isSelected: false
      },
      {
        id: 'luxury-tent',
        name: 'Luxury Tent',
        description: 'Ultimate glamping experience with all amenities',
        pricePerNight: 150,
        maxOccupancy: 4,
        features: ['Waterproof', 'King-size bed', 'Private bathroom', 'Mini-fridge', 'Heating/AC'],
        isSelected: false
      }
    ];
  }

  private getDummyAddOns(): AddOn[] {
    return [
      {
        id: 'guided-tour',
        name: 'Guided Tour',
        description: 'Professional guide for hiking and sightseeing',
        price: 75,
        duration: '4 hours',
        icon: 'hiking',
        isSelected: false
      },
      {
        id: 'stargazing',
        name: 'Stargazing Session',
        description: 'Telescope session with astronomy expert',
        price: 45,
        duration: '2 hours',
        icon: 'star',
        isSelected: false
      },
      {
        id: 'campfire-dinner',
        name: 'Campfire Dinner',
        description: 'Traditional campfire cooking experience',
        price: 35,
        duration: '3 hours',
        icon: 'local-fire-department',
        isSelected: false
      },
      {
        id: 'photography-session',
        name: 'Photography Session',
        description: 'Professional landscape photography guidance',
        price: 60,
        duration: '3 hours',
        icon: 'camera-alt',
        isSelected: false
      }
    ];
  }

  private getSupportOptions(): SupportOption[] {
    return [
      {
        id: 'chat-support',
        title: 'Chat with Support',
        subtitle: 'Get instant help via chat',
        icon: 'chat',
        action: 'chat',
        contact: 'support@tentinhimalayas.com'
      },
      {
        id: 'call-support',
        title: 'Call 24/7 Support',
        subtitle: 'Speak directly with our team',
        icon: 'phone',
        action: 'call',
        contact: '+1-800-HIMALAYA'
      }
    ];
  }
}