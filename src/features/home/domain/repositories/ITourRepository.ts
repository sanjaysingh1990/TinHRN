
import { Tour } from '../entities/Tour';

export interface ITourRepository {
  getHotTours(): Promise<Tour[]>;
  getHotToursPaginated(page: number, limit: number): Promise<Tour[]>;
}
