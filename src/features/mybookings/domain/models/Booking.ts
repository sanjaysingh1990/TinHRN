export interface Booking {
  id: string; // Firestore document IDs are strings
  tourId: string;
  vendor: string;
  bookingReference: string;
  tourName: string;
  tourImage: string;
  startDate: Date;
  endDate: Date;
  status: string;
  type: "upcoming" | "past";
  totalPrice?: number;
  customization?: {
    tentType: {
      type: string;
      price: number;
    };
    addons: Array<{
      addonName: string;
      addonDescription: string;
      addOnPrice: number;
    }>;
  };
}