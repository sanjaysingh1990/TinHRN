
import { Tour } from '../entities/Tour';

export interface ITourRepository {
  getHotTours(): Promise<Tour[]>;
}
