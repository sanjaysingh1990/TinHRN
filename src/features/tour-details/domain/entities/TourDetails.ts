
export interface ItineraryItem {
  day: string;
  title: string;
  icon: string;
}

export interface Review {
  id: string;
  avatar: string;
  name: string;
  date: string;
  rating: number;
  review: string;
}

export interface TourDetails {
  overview: string;
  itinerary: ItineraryItem[];
  pricing: {
    standard: string;
    premium: string;
  };
  reviews: Review[];
}
