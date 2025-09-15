import { GalleryData, Post } from '../entities/Gallery';

export interface IGalleryRepository {
  getGalleryData(): Promise<GalleryData>;
  getPostById(id: string): Promise<Post>;
}