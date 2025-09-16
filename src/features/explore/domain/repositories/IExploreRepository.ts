import { ExploreData, ExploreLocation } from '../entities/Explore';
import { FilterState } from '../../presentation/screens/ExploreFilterViewModel';

export interface IExploreRepository {
  getExploreData(): Promise<ExploreData>;
  getExploreLocationsData(filters?: FilterState): Promise<ExploreLocation[]>;
}