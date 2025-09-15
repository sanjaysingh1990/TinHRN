import { injectable } from 'tsyringe';
import { ExploreData, Category, Destination, TopTrek } from '../../domain/entities/Explore';
import { IExploreRepository } from '../../domain/repositories/IExploreRepository';

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
}