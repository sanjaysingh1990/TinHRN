import { ExploreData } from '../entities/Explore';

export interface IExploreRepository {
  getExploreData(): Promise<ExploreData>;
}