import { inject, injectable } from 'tsyringe';
import { GetGalleryDataUseCaseToken, GetPostByIdUseCaseToken } from '../../data/di/tokens';
import { Category, Post } from '../../domain/entities/Gallery';
import { GetGalleryDataUseCase, GetPostByIdUseCase } from '../../domain/usecases/GalleryUseCases';

@injectable()
export class GalleryViewModel {
  private _loading = false;
  private _featuredPost: Post | null = null;
  private _categories: Category[] = [];
  private _recentUploads: Post[] = [];

  constructor(
    @inject(GetGalleryDataUseCaseToken) private getGalleryDataUseCase: GetGalleryDataUseCase,
    @inject(GetPostByIdUseCaseToken) private getPostByIdUseCase: GetPostByIdUseCase
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  get featuredPost(): Post | null {
    return this._featuredPost;
  }

  get categories(): Category[] {
    return this._categories;
  }

  get recentUploads(): Post[] {
    return this._recentUploads;
  }

  async loadGalleryData(): Promise<void> {
    this._loading = true;
    try {
      const galleryData = await this.getGalleryDataUseCase.execute();
      this._featuredPost = galleryData.featuredPost;
      this._categories = galleryData.categories;
      this._recentUploads = galleryData.recentUploads;
    } catch (error) {
      console.error('Error loading gallery data:', error);
    } finally {
      this._loading = false;
    }
  }

  async getPostById(id: string): Promise<Post> {
    return await this.getPostByIdUseCase.execute(id);
  }
}