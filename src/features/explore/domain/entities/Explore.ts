export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  rating: number;
}

export interface TopTrek {
  id: number;
  name: string;
  duration: string;
  image: string;
  difficulty: string;
  altitude: string;
}

export interface ExploreLocation {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

export interface ExploreData {
  categories: Category[];
  popularDestinations: Destination[];
  topTreks: TopTrek[];
}