export interface Booking {
  id: string;                      // Booking ID (same as document ID)
  userId: string;                  // Reference to user
  tourId: string;                  // Reference to tour
  tourName: string;                // Tour name (denormalized for quick access)
  bookingReference: string;        // Booking reference number
  startDate: Date;                 // Start date of tour
  endDate: Date;                   // End date of tour
  duration: string;                // Duration (e.g., "14 Days")
  status: string;                  // Booking status (confirmed, pending, cancelled)
  totalAmount: number;             // Total amount paid
  currency: string;                // Currency code (e.g., USD)
  packageType: string;             // Package type (standard, premium)
  travelers: number;               // Number of travelers
  createdAt: Date;                 // Booking creation timestamp
  updatedAt: Date;                 // Last update timestamp
  payment: {
    method: string;                // Payment method
    status: string;                // Payment status
    transactionId: string;         // Transaction ID
  };
  customisation: {
    tentType: {
      type: string;
      price: number;
    };
    addons: [{
      addonName: string;
      addonDescription: string;
      addOnPrice: number;
    }];
  };
}