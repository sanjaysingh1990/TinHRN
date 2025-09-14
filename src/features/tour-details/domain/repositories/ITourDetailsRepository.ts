
import { TourDetails } from '../entities/TourDetails';

export interface ITourDetailsRepository {
  getTourDetails(tourId: string): Promise<TourDetails>;
}
