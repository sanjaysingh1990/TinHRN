import { injectable } from 'tsyringe';
import { Tour } from '../../domain/entities/Tour';
import { ITourRepository } from '../../domain/repositories/ITourRepository';
import TourService from '../../../../infrastructure/firebase/tour.service';
import { DocumentData } from 'firebase/firestore';

@injectable()
export class TourRepository implements ITourRepository {
  private lastVisible: DocumentData | null = null;
  private hasMoreData: boolean = true;
  private currentPage: number = 0;
  
  constructor() {
    console.log('TourRepository instance created');
  }

  async getHotTours(): Promise<Tour[]> {
    // For initial load, get first page
    this.lastVisible = null;
    this.hasMoreData = true;
    this.currentPage = 0;
    
    const result = await TourService.getHotToursPaginated(1, 10, null);
    this.lastVisible = result.lastVisible;
    this.hasMoreData = result.tours.length === 10; // Has more if we got a full page
    this.currentPage = 1; // Set current page to 1 after first load
    console.log(`TourRepository: Initial load completed, hasMoreData: ${this.hasMoreData}, currentPage: ${this.currentPage}`);
    return result.tours;
  }

  async getHotToursPaginated(page: number, limit: number): Promise<Tour[]> {
    console.log(`TourRepository: Requesting page ${page}, current page ${this.currentPage}`);
    console.log(`TourRepository: lastVisible:`, this.lastVisible);
    
    // If this is the first page, reset the pagination state
    if (page === 1) {
      console.log('TourRepository: Resetting pagination state for page 1');
      this.lastVisible = null;
      this.hasMoreData = true;
      this.currentPage = 0;
    }
    
    // If we've already fetched all data, return empty array
    if (!this.hasMoreData) {
      console.log('TourRepository: No more data to fetch');
      return [];
    }

    console.log(`TourRepository: Fetching page ${page} with lastVisible:`, this.lastVisible);
    const result = await TourService.getHotToursPaginated(page, limit, this.lastVisible);
    this.lastVisible = result.lastVisible;
    this.hasMoreData = result.tours.length > 0 && result.tours.length === limit;
    this.currentPage = page; // Update current page after successful fetch
    
    console.log(`TourRepository: Fetched ${result.tours.length} tours, hasMoreData: ${this.hasMoreData}, currentPage updated to: ${this.currentPage}`);
    console.log(`TourRepository: New lastVisible:`, this.lastVisible);
    
    return result.tours;
  }

  async searchTours(query: string): Promise<Tour[]> {
    return TourService.searchTours(query);
  }
}