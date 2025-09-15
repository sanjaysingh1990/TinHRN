import { injectable } from 'tsyringe';
import { 
  CustomizeTourData, 
  CustomizationSelection, 
  TentOption, 
  AddOn, 
  SupportOption 
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

  private generateAvailableDates(): Date[] {
    const dates: Date[] = [];
    const today = new Date();
    
    // Generate next 30 days as available dates
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
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
        features: ['Waterproof', 'Sleeping bags included', 'Basic lighting']
      },
      {
        id: 'deluxe-tent',
        name: 'Deluxe Tent',
        description: 'Spacious tent with premium comfort features',
        pricePerNight: 85,
        maxOccupancy: 3,
        features: ['Waterproof', 'Premium bedding', 'Solar charging', 'Private bathroom access']
      },
      {
        id: 'luxury-tent',
        name: 'Luxury Tent',
        description: 'Ultimate glamping experience with all amenities',
        pricePerNight: 150,
        maxOccupancy: 4,
        features: ['Waterproof', 'King-size bed', 'Private bathroom', 'Mini-fridge', 'Heating/AC']
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