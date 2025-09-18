import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { injectable } from 'tsyringe';

import { firestore } from '../../../../infrastructure/firebase/firebase.config';
import { IReviewRepository } from '../../domain/repositories/IReviewRepository';
import { Review } from '../../domain/entities/Review';

@injectable()
export class ReviewRepository implements IReviewRepository {
  async addReview(tourId: string, review: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
    try {
      const reviewsCollection = collection(firestore, 'tours', tourId, 'reviews');
      await addDoc(reviewsCollection, {
        ...review,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
}