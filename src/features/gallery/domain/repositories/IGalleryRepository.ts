import { GalleryData, Post } from '../entities/Gallery';

export interface IGalleryRepository {
  getGalleryData(): Promise<GalleryData>;
  getPostById(id: string): Promise<Post>;
  createPost(post: Omit<Post, 'id' | 'viewsCount' | 'userName' | 'userAvatar'>, onProgress?: (progress: number) => void): Promise<Post>;
}