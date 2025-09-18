export interface ItineraryItem {
  day: string;
  title: string;
  icon: string;
  location?: string;
  activity?: string;
  accommodation?: string;
  transport?: string;
  distance?: string;
  duration?: string;
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
  id: string;
  name: string;
  overview: string;
  itinerary: ItineraryItem[];
  pricing: {
    standard: string;
    premium: string;
  };
  reviews: Review[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  bestTime: string[];
  image: string;
  duration: string;
  difficulty: string;
  altitude: string;
  location: {
    country: string;
    region: string;
  };
}