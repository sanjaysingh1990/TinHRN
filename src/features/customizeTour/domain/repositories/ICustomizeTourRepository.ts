import { CustomizationSelection, CustomizeTourData } from '../entities/CustomizeTour';

export interface ICustomizeTourRepository {
  getCustomizationData(): Promise<CustomizeTourData>;
  saveCustomization(selection: CustomizationSelection): Promise<{ success: boolean; customizationId: string }>;
  processPayment(amount: number, currency: string, customerEmail: string): Promise<{ success: boolean; error?: string }>;
  bookTour(tourId: string, tourName: string, tourImage: string, selection: CustomizationSelection): Promise<{ success: boolean; bookingId: string }>;
}