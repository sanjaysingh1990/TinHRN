import { collection, getDocs, query, where } from 'firebase/firestore';
import { injectable } from 'tsyringe';
import { firestore } from '../../../../infrastructure/firebase/firebase.config';
import { Category, Destination, ExploreData, ExploreLocation, TopTrek } from '../../domain/entities/Explore';
import { IExploreRepository } from '../../domain/repositories/IExploreRepository';
import { FilterState } from '../../presentation/screens/ExploreFilterViewModel';

@injectable()
export class ExploreRepository implements IExploreRepository {
  async getExploreData(): Promise<ExploreData> {
    
    try {
      // Fetch categories from Firebase
      const categoriesCollection = collection(firestore, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categories: Category[] = [];
      
      categoriesSnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: data.id || doc.id,
          name: data.name,
          icon: data.icon || 'help', // Default icon if not provided
          color: data.color || '#000000' // Default color if not provided
        });
      });
      
      // Fetch popular destinations from Firebase
      const destinationsCollection = collection(firestore, 'destinations');
      const destinationsSnapshot = await getDocs(destinationsCollection);
      const popularDestinations: Destination[] = [];
      
      destinationsSnapshot.forEach((doc) => {
        const data = doc.data();
        popularDestinations.push({
          id: data.id || doc.id,
          name: data.name,
          country: data.country || '',
          image: data.image || '',
          rating: data.rating || 0
        });
      });
      
      // Fetch top treks from tours collection where isTopTrack is true
      const toursCollection = collection(firestore, 'tours');
      const topTracksQuery = query(
        toursCollection, 
        where('isTopTrack', '==', true)
      );
      const topTracksSnapshot = await getDocs(topTracksQuery);
      const topTreks: TopTrek[] = [];
      
      // Take only the top 5 tours
      let count = 0;
      topTracksSnapshot.forEach((doc) => {
        if (count < 5) {
          const data = doc.data();
          topTreks.push({
            id: data.id || doc.id,
            name: data.name,
            duration: data.duration || '',
            image: data.image || '',
            difficulty: data.difficulty || '',
            altitude: data.altitude || ''
          });
          count++;
        }
      });
      
      return {
        categories,
        popularDestinations,
        topTreks
      };
    } catch (error) {
      console.error('Error fetching explore data from Firebase:', error);
      // Return empty arrays on error
      return {
        categories: [],
        popularDestinations: [],
        topTreks: []
      };
    }
  }

  async getExploreLocationsData(filters?: FilterState): Promise<ExploreLocation[]> {
    try {
      // Fetch tours from Firebase
      const toursCollection = collection(firestore, 'tours');
      const toursSnapshot = await getDocs(toursCollection);
      const exploreLocations: ExploreLocation[] = [];
      
      toursSnapshot.forEach((doc) => {
        const data = doc.data();
        exploreLocations.push({
          id: data.id || doc.id,
          title: data.name || '',
          description: data.description || '',
          imageUrl: data.image || '',
          latitude: data.location?.coordinates?.latitude || 0,
          longitude: data.location?.coordinates?.longitude || 0,
          difficulty: data.difficulty || undefined,
          terrain: [], // Firebase data doesn't have terrain field
          amenities: [], // Firebase data doesn't have amenities field
          duration: data.duration ? parseInt(data.duration) || undefined : undefined
        });
      });
      
      // Apply filters if provided
      let filteredData = [...exploreLocations];
      
      if (filters) {
        // Filter by difficulty
        if (filters.difficulty) {
          filteredData = filteredData.filter(item => item.difficulty === filters.difficulty);
        }
        
        // Filter by terrain (item must have ALL selected terrains)
        // Since Firebase data doesn't have terrain field, we'll skip this filter
        // In a real implementation, you would need to add terrain data to Firebase
        
        // Filter by amenities (item must have ALL selected amenities)
        // Since Firebase data doesn't have amenities field, we'll skip this filter
        // In a real implementation, you would need to add amenities data to Firebase
        
        // Filter by duration range
        if (filters.durationRange) {
          const [minDuration, maxDuration] = filters.durationRange;
          filteredData = filteredData.filter(item => {
            const duration = item.duration || 0;
            return duration >= minDuration && (maxDuration >= 14 ? duration >= minDuration : duration <= maxDuration);
          });
        }
      }
      
      return filteredData;
    } catch (error) {
      console.error('Error fetching explore locations data from Firebase:', error);
      // Return empty array on error
      return [];
    }
  }
}