import { firestore } from './firebase.config';
import { collection, getDocs, query, limit, startAfter, orderBy, where, DocumentData } from 'firebase/firestore';
import { Tour } from '../../features/home/domain/entities/Tour';

interface FirestoreTour {
  id: string;
  name: string;
  duration: string;
  image: string;
  // Add other fields as needed
}

class TourService {
  private toursCollection = collection(firestore, 'tours');

  async getHotToursPaginated(page: number, limitCount: number, lastVisible: DocumentData | null = null): Promise<{ tours: Tour[]; lastVisible: DocumentData | null }> {
    try {
      let q = query(
        this.toursCollection,
        orderBy('name'),
        limit(limitCount)
      );

      if (lastVisible) {
        q = query(
          this.toursCollection,
          orderBy('name'),
          startAfter(lastVisible),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const tours: Tour[] = [];
      let lastDoc: DocumentData | null = null;

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as FirestoreTour;
          tours.push({
            id: doc.id, // Keep the original string ID from Firestore
            name: data.name,
            duration: data.duration,
            image: data.image,
          });
          lastDoc = doc;
        });
      }

      return { tours, lastVisible: lastDoc };
    } catch (error) {
      console.error('Error fetching tours from Firestore:', error);
      return { tours: [], lastVisible: null };
    }
  }

  async searchTours(searchQuery: string): Promise<Tour[]> {
    try {
      const q = query(
        this.toursCollection,
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const tours: Tour[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreTour;
        tours.push({
          id: doc.id, // Keep the original string ID from Firestore
          name: data.name,
          duration: data.duration,
          image: data.image,
        });
      });

      return tours;
    } catch (error) {
      console.error('Error searching tours in Firestore:', error);
      return [];
    }
  }
}

export default new TourService();