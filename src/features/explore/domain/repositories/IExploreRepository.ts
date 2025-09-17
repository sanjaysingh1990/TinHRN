import { FilterState } from '../../presentation/screens/ExploreFilterViewModel';
import { ExploreData, ExploreLocation } from '../entities/Explore';

export interface IExploreRepository {
  getExploreData(): Promise<ExploreData>;
  getExploreLocationsData(filters?: FilterState): Promise<ExploreLocation[]>;
}