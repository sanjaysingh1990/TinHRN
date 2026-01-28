import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { Tour } from '../../domain/entities/Tour';
import { ITourRepository } from '../../domain/repositories/ITourRepository';
import { TourRepositoryToken } from '../../home.di';

@injectable()
export class HomeViewModel extends BaseViewModel {
  private _tours: Tour[] = [];
  private _isLoading = false;
  private _loadingMore = false;
  private _hasMore = true;
  private _page = 1;
  private _isFetching = false;

  constructor(
    @inject(TourRepositoryToken) private tourRepository: ITourRepository
  ) {
    super();
    console.log('HomeViewModel instance created');
  }

  get tours(): Tour[] {
    return this._tours;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get loadingMore(): boolean {
    return this._loadingMore;
  }

  get hasMore(): boolean {
    return this._hasMore;
  }

  async loadTours(): Promise<void> {
    if (this._isFetching || !this._hasMore) return;

    this._isFetching = true;
    if (this._page === 1) {
      this._isLoading = true;
    } else {
      this._loadingMore = true;
    }
    this.notifyUpdate();

    try {
      const limit = 10;
      const newTours = await this.tourRepository.getHotToursPaginated(this._page, limit);

      if (newTours.length === 0) {
        this._hasMore = false;
      } else {
        // Simple deduplication based on ID
        const existingIds = new Set(this._tours.map(t => t.id));
        const uniqueTours = newTours.filter(t => !existingIds.has(t.id));

        this._tours = [...this._tours, ...uniqueTours];
        this._page += 1;
      }
    } catch (error) {
      console.error('HomeViewModel: Error loading tours:', error);
    } finally {
      this._isLoading = false;
      this._loadingMore = false;
      this._isFetching = false;
      this.notifyUpdate();
    }
  }

  async refreshTours(): Promise<void> {
    this._page = 1;
    this._tours = [];
    this._hasMore = true;
    this._isFetching = false;
    await this.loadTours();
  }

  async searchTours(query: string): Promise<void> {
    if (!query) {
      await this.refreshTours();
      return;
    }

    this._isLoading = true;
    this.notifyUpdate();

    try {
      const result = await this.tourRepository.searchTours(query);
      this._tours = result;
      this._hasMore = false; // Search results are usually not paginated in this simple implementation
    } catch (error) {
      console.error('HomeViewModel: Error searching tours:', error);
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  // Deprecated compatibility methods
  async getHotTours(): Promise<Tour[]> {
    return this.tourRepository.getHotTours();
  }

  async getHotToursPaginated(page: number, limit: number): Promise<Tour[]> {
    return this.tourRepository.getHotToursPaginated(page, limit);
  }
}