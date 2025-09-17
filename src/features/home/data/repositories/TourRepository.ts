import { injectable } from 'tsyringe';
import { Tour } from '../../domain/entities/Tour';
import { ITourRepository } from '../../domain/repositories/ITourRepository';
import TourService from '../../../../infrastructure/firebase/tour.service';
import { DocumentData } from 'firebase/firestore';

@injectable()
export class TourRepository implements ITourRepository {
  private lastVisible: DocumentData | null = null;
  private hasMoreData: boolean = true;

  async getHotTours(): Promise<Tour[]> {
    // For initial load, get first page
    const result = await TourService.getHotToursPaginated(1, 10);
    this.lastVisible = result.lastVisible;
    this.hasMoreData = result.tours.length > 0;
    return result.tours;
  }

  async getHotToursPaginated(page: number, limit: number): Promise<Tour[]> {
    // For pagination, we'll use the lastVisible document from previous query
    // If this is the first page, reset the pagination state
    if (page === 1) {
      this.lastVisible = null;
      this.hasMoreData = true;
    }

    // If we've already fetched all data, return empty array
    if (!this.hasMoreData) {
      return [];
    }

    const result = await TourService.getHotToursPaginated(page, limit, this.lastVisible);
    this.lastVisible = result.lastVisible;
    this.hasMoreData = result.tours.length > 0 && result.tours.length === limit;
    
    return result.tours;
  }

  async searchTours(query: string): Promise<Tour[]> {
    return TourService.searchTours(query);
  }
}