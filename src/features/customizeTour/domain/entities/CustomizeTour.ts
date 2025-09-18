export interface CustomizeTourData {
  availableDates: Date[];
  tentOptions: TentOption[];
  addOns: AddOn[];
  supportOptions: SupportOption[];
}

export interface TentOption {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxOccupancy: number;
  features: string[];
  isSelected?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  icon: string;
  isSelected: boolean;
}

export interface SupportOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: 'chat' | 'call';
  contact?: string;
}

export interface CustomizationSelection {
  startDate: Date | null;
  endDate: Date | null;
  selectedTent: TentOption | null;
  selectedAddOns: AddOn[];
  totalPrice: number;
}