import { injectable, inject } from 'tsyringe';
import { ExploreRepositoryToken } from '../../explore.di';
import { IExploreRepository } from '../../domain/repositories/IExploreRepository';
import { Destination } from '../../domain/entities/Explore';

export interface ExploreLocation {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

@injectable()
export class MapViewExploreScreenViewModel {
  private _loading: boolean = false;
  private _exploreData: ExploreLocation[] = [];
  private _error: string | null = null;
  private _updateCallback: (() => void) | null = null;

  constructor(
    @inject(ExploreRepositoryToken) private exploreRepository: IExploreRepository
  ) {}

  // Getters
  get loading(): boolean {
    return this._loading;
  }

  get exploreData(): ExploreLocation[] {
    return this._exploreData;
  }

  get error(): string | null {
    return this._error;
  }

  // Set update callback for view updates
  setUpdateCallback(callback: () => void): void {
    this._updateCallback = callback;
  }

  // Notify view of state changes
  private notifyUpdate(): void {
    if (this._updateCallback) {
      this._updateCallback();
    }
  }

  // Convert Destination to ExploreLocation with dummy coordinates
  private convertToExploreLocation(destination: Destination, index: number): ExploreLocation {
    // Base coordinates for Himalayas region with slight variations
    const baseLatitude = 30.7316;
    const baseLongitude = 79.6089;
    
    return {
      id: destination.id.toString(),
      title: destination.name,
      description: `Explore ${destination.name} in ${destination.country} - Rating: ${destination.rating}/5`,
      imageUrl: destination.image,
      latitude: baseLatitude + (index * 0.5), // Spread locations vertically
      longitude: baseLongitude + (index * 0.3), // Spread locations horizontally
    };
  }

  // Load explore data
  async loadExploreData(): Promise<void> {
    this._loading = true;
    this._error = null;
    this.notifyUpdate();

    try {
      // Simulate 1-second delay for map view loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const exploreData = await this.exploreRepository.getExploreData();
      
      // Convert popular destinations to explore locations
      this._exploreData = exploreData.popularDestinations.map((destination: Destination, index: number) => 
        this.convertToExploreLocation(destination, index)
      );
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Failed to load explore data';
      console.error('Error loading explore data:', error);
    } finally {
      this._loading = false;
      this.notifyUpdate();
    }
  }

  // Reset state
  reset(): void {
    this._loading = false;
    this._exploreData = [];
    this._error = null;
    this.notifyUpdate();
  }
}