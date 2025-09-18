import { inject, injectable } from 'tsyringe';
import { Review } from '../../domain/entities/Review';
import { IReviewRepository } from '../../domain/repositories/IReviewRepository';
import { ReviewRepositoryToken } from '../../addreview.di';

@injectable()
export class AddReviewScreenViewModel {
  private _rating: number = 0;
  private _reviewText: string = '';
  private _loading: boolean = false;
  private _error: string | null = null;

  constructor(
    @inject(ReviewRepositoryToken) private reviewRepository: IReviewRepository
  ) {}

  // Getters
  get rating(): number {
    return this._rating;
  }

  get reviewText(): string {
    return this._reviewText;
  }

  get loading(): boolean {
    return this._loading;
  }

  get error(): string | null {
    return this._error;
  }

  // Setters
  setRating(stars: number): void {
    this._rating = stars;
  }

  setReviewText(text: string): void {
    this._reviewText = text;
  }

  // Methods
  async submitReview(tourId: string, userId: string, userName: string, userPhotoURL: string): Promise<boolean> {
    if (this._rating === 0) {
      this._error = 'Please provide a rating';
      return false;
    }

    if (this._reviewText.trim().length === 0) {
      this._error = 'Please write a review';
      return false;
    }

    this._loading = true;
    this._error = null;

    try {
      const review: Omit<Review, 'id' | 'createdAt'> = {
        tourId,
        userId,
        userName,
        userPhotoURL,
        rating: this._rating,
        review: this._reviewText,
        helpful: 0,
      };

      await this.reviewRepository.addReview(tourId, review);
      return true;
    } catch (error) {
      this._error = 'Failed to submit review. Please try again.';
      console.error('Error submitting review:', error);
      return false;
    } finally {
      this._loading = false;
    }
  }

  clearError(): void {
    this._error = null;
  }
}