
export interface Booking {
  id: number;
  vendor: string;
  title: string;
  dateRange: string;
  imageUrl: string;
  type: "upcoming" | "past";
}
