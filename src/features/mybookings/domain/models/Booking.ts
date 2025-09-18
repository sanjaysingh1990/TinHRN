export interface Booking {
  id: string; // Firestore document IDs are strings
  vendor: string;
  tourName: string;
  tourImage: string;
  startDate: Date;
  endDate: Date;
  status: string;
  type: "upcoming" | "past";
}