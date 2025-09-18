export interface Review {
  id: string;
  tourId: string;
  userId: string;
  userName: string;
  userPhotoURL: string;
  rating: number;
  review: string;
  helpful: number;
  createdAt: Date;
}