import { CustomizeTourData, CustomizationSelection } from '../entities/CustomizeTour';

export interface ICustomizeTourRepository {
  getCustomizationData(): Promise<CustomizeTourData>;
  saveCustomization(selection: CustomizationSelection): Promise<{ success: boolean; customizationId: string }>;
  bookTour(selection: CustomizationSelection): Promise<{ success: boolean; bookingId: string }>;
}