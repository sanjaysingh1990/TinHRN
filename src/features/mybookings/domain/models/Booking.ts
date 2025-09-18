export interface Booking {
  id: string; // Firestore document IDs are strings
  userId: string;
  tourId: string;
  tourName: string;
  tourImage: string;
  bookingReference: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  status: string;
  totalAmount: number;
  currency: string;
  packageType: string;
  travelers: number;
  createdAt: Date;
  updatedAt: Date;
  vendor: string;
  payment: {
    method: string;
    status: string;
    transactionId: string;
  };
  customisation: {
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
  type: "upcoming" | "past";
}