import { injectable } from 'tsyringe';
import { Category, Destination, ExploreData, ExploreLocation, TopTrek } from '../../domain/entities/Explore';
import { IExploreRepository } from '../../domain/repositories/IExploreRepository';
import { FilterState } from '../../presentation/screens/ExploreFilterViewModel';

const dummyCategories: Category[] = [
  {
    id: 1,
    name: 'Treks',
    icon: 'terrain',
    color: '#4CAF50'
  },
  {
    id: 2,
    name: 'Adventures',
    icon: 'outdoor-grill',
    color: '#FF9800'
  },
  {
    id: 3,
    name: 'Spiritual',
    icon: 'self-improvement',
    color: '#9C27B0'
  },
  {
    id: 4,
    name: 'Wildlife',
    icon: 'pets',
    color: '#2196F3'
  }
];

const dummyDestinations: Destination[] = [
  {
    id: 1,
    name: 'Annapurna Circuit',
    country: 'Nepal',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Everest Base Camp',
    country: 'Nepal',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Langtang Valley',
    country: 'Nepal',
    image: 'https://images.unsplash.com/photo-1604537529428-15bc512c298a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Manaslu Circuit',
    country: 'Nepal',
    image: 'https://images.unsplash.com/photo-1542395975-16a58c6b68f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.6
  },
  {
    id: 5,
    name: 'Upper Mustang',
    country: 'Nepal',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.5
  }
];

const dummyExploreLocations: ExploreLocation[] = [
  {
    id: "1",
    title: "Trek to Annapurna Base Camp",
    description: "Experience the beauty of the Annapurna range with stunning mountain views.",
    imageUrl: "https://picsum.photos/400/200?random=1",
    latitude: 28.5306,
    longitude: 83.8795,
    difficulty: "Moderate",
    terrain: ["Mountainous", "Forest"],
    amenities: ["Restrooms", "Water Sources"],
    duration: 14
  },
  {
    id: "2",
    title: "Explore the Everest Region",
    description: "Challenge yourself with the world's highest peak and surrounding valleys.",
    imageUrl: "https://picsum.photos/400/200?random=2",
    latitude: 27.9881,
    longitude: 86.925,
    difficulty: "Challenging",
    terrain: ["Mountainous"],
    amenities: ["Water Sources"],
    duration: 16
  },
  {
    id: "3",
    title: "Discover the Langtang Valley",
    description: "Immerse yourself in the serene Langtang Valley with its pristine landscapes.",
    imageUrl: "https://picsum.photos/400/200?random=3",
    latitude: 28.2111,
    longitude: 85.5533,
    difficulty: "Easy",
    terrain: ["Forest", "River"],
    amenities: ["Restrooms"],
    duration: 12
  },
  {
    id: "4",
    title: "Manaslu Circuit Adventure",
    description: "Trek through remote villages and witness the majestic Manaslu peak.",
    imageUrl: "https://picsum.photos/400/200?random=4",
    latitude: 28.549,
    longitude: 84.5621,
    difficulty: "Challenging",
    terrain: ["Mountainous", "Forest"],
    amenities: ["Water Sources"],
    duration: 18
  },
  {
    id: "5",
    title: "Gokyo Lakes Trek",
    description: "Visit the sacred Gokyo lakes with breathtaking Himalayan views.",
    imageUrl: "https://picsum.photos/400/200?random=5",
    latitude: 27.9618,
    longitude: 86.6882,
    difficulty: "Moderate",
    terrain: ["Mountainous", "River"],
    amenities: ["Restrooms", "Water Sources"],
    duration: 15
  },
  {
    id: "6",
    title: "Short Valley Walk",
    description: "Easy walk through peaceful valleys with basic facilities.",
    imageUrl: "https://picsum.photos/400/200?random=6",
    latitude: 28.1234,
    longitude: 84.1234,
    difficulty: "Easy",
    terrain: ["Forest"],
    amenities: ["Restrooms"],
    duration: 3
  },
  {
    id: "7",
    title: "River Valley Adventure",
    description: "Follow mountain rivers through scenic valleys.",
    imageUrl: "https://picsum.photos/400/200?random=7",
    latitude: 27.5678,
    longitude: 85.9876,
    difficulty: "Easy",
    terrain: ["River", "Forest"],
    amenities: ["Water Sources"],
    duration: 5
  }
];

const dummyTopTreks: TopTrek[] = [
  {
    id: 1,
    name: 'Annapurna Base Camp Trek',
    duration: '14 Days',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    difficulty: 'Moderate',
    altitude: '4,130m'
  },
  {
    id: 2,
    name: 'Everest Base Camp Trek',
    duration: '16 Days',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    difficulty: 'Challenging',
    altitude: '5,364m'
  },
  {
    id: 3,
    name: 'Langtang Valley Trek',
    duration: '12 Days',
    image: 'https://images.unsplash.com/photo-1604537529428-15bc512c298a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    difficulty: 'Easy',
    altitude: '4,984m'
  },
  {
    id: 4,
    name: 'Manaslu Circuit Trek',
    duration: '18 Days',
    image: 'https://images.unsplash.com/photo-1542395975-16a58c6b68f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    difficulty: 'Challenging',
    altitude: '5,106m'
  },
  {
    id: 5,
    name: 'Gokyo Lakes Trek',
    duration: '15 Days',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    difficulty: 'Moderate',
    altitude: '5,357m'
  }
];

@injectable()
export class ExploreRepository implements IExploreRepository {
  async getExploreData(): Promise<ExploreData> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          categories: dummyCategories,
          popularDestinations: dummyDestinations,
          topTreks: dummyTopTreks
        });
      }, 3000); // 3 second delay as requested
    });
  }

  async getExploreLocationsData(filters?: FilterState): Promise<ExploreLocation[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        let filteredData = [...dummyExploreLocations];
        
        if (filters) {
          // Filter by difficulty
          if (filters.difficulty) {
            filteredData = filteredData.filter(item => item.difficulty === filters.difficulty);
          }
          
          // Filter by terrain (item must have ALL selected terrains)
          if (filters.terrains && filters.terrains.length > 0) {
            filteredData = filteredData.filter(item => 
              filters.terrains!.every(terrain => item.terrain?.includes(terrain))
            );
          }
          
          // Filter by amenities (item must have ALL selected amenities)
          if (filters.amenities && filters.amenities.length > 0) {
            filteredData = filteredData.filter(item => 
              filters.amenities!.every(amenity => item.amenities?.includes(amenity))
            );
          }
          
          // Filter by duration range
          if (filters.durationRange) {
            const [minDuration, maxDuration] = filters.durationRange;
            filteredData = filteredData.filter(item => {
              const duration = item.duration || 0;
              return duration >= minDuration && (maxDuration >= 14 ? duration >= minDuration : duration <= maxDuration);
            });
          }
        }
        
        resolve(filteredData);
      }, 1000); // 1 second delay as requested
    });
  }
}