import { container } from 'tsyringe';
import { BlogRepositoryToken } from '../../blog.di';
import { BlogRepository } from '../../data/repositories/BlogRepository';
import { Blog } from '../../domain/models/Blog';
import { BlogContent } from '../../domain/models/BlogContent';

export class BlogDetailViewModel {
  private blogRepository: BlogRepository;
  public blog: Blog | null = null;
  public content: BlogContent | null = null;
  public loading = false;
  public error: string | null = null;

  constructor() {
    this.blogRepository = container.resolve<BlogRepository>(BlogRepositoryToken);
  }

  public async fetchBlogDetail(blogId: string): Promise<void> {
    console.log('[BlogDetailViewModel] fetchBlogDetail called with blogId:', blogId);
    this.loading = true;
    this.error = null;
    
    try {
      const result = await this.blogRepository.fetchBlogDetail(blogId);
      console.log('[BlogDetailViewModel] fetchBlogDetail result:', result);
      if (result) {
        this.blog = result.blog;
        this.content = result.content;
        console.log('[BlogDetailViewModel] Data set successfully');
      } else {
        this.error = 'Blog not found.';
        console.log('[BlogDetailViewModel] Blog not found');
      }
    } catch (error) {
      this.error = 'Failed to fetch blog details. Please try again.';
      console.error('[BlogDetailViewModel] Error in fetchBlogDetail:', error);
    } finally {
      this.loading = false;
      console.log('[BlogDetailViewModel] Loading set to false');
    }
  }
}