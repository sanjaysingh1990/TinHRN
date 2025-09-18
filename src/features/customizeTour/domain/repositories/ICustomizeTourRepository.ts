import { CustomizationSelection, CustomizeTourData } from '../entities/CustomizeTour';

export interface ICustomizeTourRepository {
  getCustomizationData(): Promise<CustomizeTourData>;
  saveCustomization(selection: CustomizationSelection): Promise<{ success: boolean; customizationId: string }>;
  bookTour(tourId: string, selection: CustomizationSelection): Promise<{ success: boolean; bookingId: string }>;
}