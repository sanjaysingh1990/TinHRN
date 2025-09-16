import { ExploreData, ExploreLocation } from '../entities/Explore';

export interface IExploreRepository {
  getExploreData(): Promise<ExploreData>;
  getExploreLocationsData(): Promise<ExploreLocation[]>;
}