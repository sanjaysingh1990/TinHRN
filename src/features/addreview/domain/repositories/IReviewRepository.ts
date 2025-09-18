import { Review } from '../entities/Review';

export interface IReviewRepository {
  addReview(tourId: string, review: Omit<Review, 'id' | 'createdAt'>): Promise<void>;
}