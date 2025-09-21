import { container } from 'tsyringe';
import { BlogRepositoryToken } from '../../blog.di';
import { BlogRepository } from '../../data/repositories/BlogRepository';
import { Blog } from '../../domain/models/Blog';

export class BlogListViewModel {
  private blogRepository: BlogRepository;
  public blogs: Blog[] = [];
  public loading = false;
  public error: string | null = null;

  constructor() {
    console.log('[BlogListViewModel] Constructor called');
    this.blogRepository = container.resolve<BlogRepository>(BlogRepositoryToken);
  }

  public async fetchBlogs(): Promise<void> {
    console.log('[BlogListViewModel] fetchBlogs called, current state:', {
      loading: this.loading,
      blogsCount: this.blogs.length,
      hasError: !!this.error
    });
    
    this.loading = true;
    this.error = null;
    console.log('[BlogListViewModel] Set loading to true');
    
    try {
      console.log('[BlogListViewModel] Calling blogRepository.fetchBlogs()');
      this.blogs = await this.blogRepository.fetchBlogs();
      console.log('[BlogListViewModel] Successfully fetched blogs, count:', this.blogs.length);
    } catch (error) {
      this.error = 'Failed to fetch blogs. Please try again.';
      console.error('[BlogListViewModel] Error in fetchBlogs:', error);
    } finally {
      this.loading = false;
      console.log('[BlogListViewModel] Set loading to false, final state:', {
        loading: this.loading,
        blogsCount: this.blogs.length,
        hasError: !!this.error
      });
    }
  }
}