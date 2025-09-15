import { inject, injectable } from 'tsyringe';
import { GalleryRepositoryToken } from '../../data/di/tokens';
import { GalleryData, Post } from '../entities/Gallery';
import { IGalleryRepository } from '../repositories/IGalleryRepository';

@injectable()
export class GetGalleryDataUseCase {
  constructor(
    @inject(GalleryRepositoryToken) private galleryRepository: IGalleryRepository
  ) {}

  async execute(): Promise<GalleryData> {
    return await this.galleryRepository.getGalleryData();
  }
}

@injectable()
export class GetPostByIdUseCase {
  constructor(
    @inject(GalleryRepositoryToken) private galleryRepository: IGalleryRepository
  ) {}

  async execute(id: string): Promise<Post> {
    return await this.galleryRepository.getPostById(id);
  }
}