import { inject, injectable } from 'tsyringe';
import { ExploreLocation } from '../../domain/entities/Explore';
import { IExploreRepository } from '../../domain/repositories/IExploreRepository';
import { ExploreRepositoryToken } from '../../explore.di';
import { FilterState } from '../screens/ExploreFilterViewModel';

@injectable()
export class MapViewExploreScreenViewModel {
  private _loading = true;
  private _exploreData: ExploreLocation[] = [];
  private _error: string | null = null;
  private updateCallback: (() => void) | null = null;

  constructor(
    @inject(ExploreRepositoryToken) private exploreRepository: IExploreRepository
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  get exploreData(): ExploreLocation[] {
    return this._exploreData;
  }

  get error(): string | null {
    return this._error;
  }

  setUpdateCallback(callback: () => void): void {
    this.updateCallback = callback;
  }

  private notifyUpdate(): void {
    if (this.updateCallback) {
      this.updateCallback();
    }
  }

  async loadExploreData(filters?: FilterState): Promise<void> {
    try {
      this._loading = true;
      this._error = null;
      this.notifyUpdate();

      const data = await this.exploreRepository.getExploreLocationsData(filters);
      this._exploreData = data;
      this._loading = false;
      this.notifyUpdate();
    } catch (error) {
      console.error('Error loading explore data:', error);
      this._error = 'Failed to load explore data';
      this._loading = false;
      this._exploreData = [];
      this.notifyUpdate();
    }
  }

  async applyFilters(filters: FilterState): Promise<void> {
    await this.loadExploreData(filters);
  }

  reset(): void {
    this._loading = true;
    this._exploreData = [];
    this._error = null;
    this.updateCallback = null;
  }
}

// Export the ExploreLocation interface for use in components
export { ExploreLocation };
