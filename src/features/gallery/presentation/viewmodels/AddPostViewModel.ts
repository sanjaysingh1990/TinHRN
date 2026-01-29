import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { UploadService } from '../../../../core/services/UploadService';
import { CreatePostUseCaseToken, GalleryViewModelToken } from '../../data/di/tokens';
import { CreatePostUseCase } from '../../domain/usecases/GalleryUseCases';
import { GalleryViewModel } from './GalleryViewModel';

@injectable()
export class AddPostViewModel extends BaseViewModel {
    private _title = '';
    private _description = '';
    private _selectedCategoryId = '';
    private _imageUrl = '';
    private _isSubmitting = false;

    constructor(
        @inject(CreatePostUseCaseToken) private createPostUseCase: CreatePostUseCase,
        @inject(UploadService) private uploadService: UploadService,
        @inject(GalleryViewModelToken) private galleryViewModel: GalleryViewModel
    ) {
        super();
    }

    async loadCategories() {
        if (this.galleryViewModel.categories.length === 0) {
            await this.galleryViewModel.loadGalleryData();
            this.notifyUpdate();
        }
    }

    get categories() { return this.galleryViewModel.categories; }

    resetForm() {
        this._title = '';
        this._description = '';
        this._selectedCategoryId = '';
        this._imageUrl = '';
        this._isSubmitting = false;
        this.notifyUpdate();
    }
    get title() { return this._title; }
    get description() { return this._description; }
    get selectedCategoryId() { return this._selectedCategoryId; }
    get imageUrl() { return this._imageUrl; }
    get isSubmitting() { return this._isSubmitting; }

    setTitle(title: string) {
        this._title = title;
        this.notifyUpdate();
    }

    setDescription(description: string) {
        this._description = description;
        this.notifyUpdate();
    }

    setSelectedCategoryId(categoryId: string) {
        this._selectedCategoryId = categoryId;
        this.notifyUpdate();
    }

    setImageUrl(url: string) {
        this._imageUrl = url;
        this.notifyUpdate();
    }

    get canSubmit(): boolean {
        return (
            this._title.trim().length > 0 &&
            this._description.trim().length > 0 &&
            this._selectedCategoryId !== '' &&
            this._imageUrl !== ''
        );
    }

    async createPost(): Promise<boolean> {
        if (!this.canSubmit) return false;

        this._isSubmitting = true;
        this.notifyUpdate();

        // Start global upload progress
        this.uploadService.startUpload(this._title);

        try {
            const category = this.galleryViewModel.categories.find(c => c.id === this._selectedCategoryId);

            await this.createPostUseCase.execute(
                {
                    title: this._title,
                    description: this._description,
                    category: category?.name || 'Uncategorized',
                    imageUrl: this._imageUrl,
                },
                (progress) => {
                    this.uploadService.setProgress(progress);
                }
            );

            this.uploadService.finishUpload();

            // Refresh gallery data
            await this.galleryViewModel.loadGalleryData();

            return true;
        } catch (error) {
            console.error('AddPostViewModel: Error creating post:', error);
            this.uploadService.setError('Failed to create post');
            return false;
        } finally {
            this._isSubmitting = false;
            this.notifyUpdate();
        }
    }
}
