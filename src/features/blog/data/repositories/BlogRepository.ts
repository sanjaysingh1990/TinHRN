import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '../../../../infrastructure/firebase/firebase.config';
import { Blog } from '../../domain/models/Blog';
import { BlogContent } from '../../domain/models/BlogContent';

export interface BlogRepository {
  fetchBlogs(): Promise<Blog[]>;
  fetchBlogDetail(blogId: string): Promise<{ blog: Blog; content: BlogContent } | null>;
}

export class BlogRepositoryImpl implements BlogRepository {
  async fetchBlogs(): Promise<Blog[]> {
    console.log('[BlogRepository] fetchBlogs called');
    try {
      const blogsRef = collection(firestore, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      console.log('[BlogRepository] Executing query for blogs');
      const querySnapshot = await getDocs(q);
      console.log('[BlogRepository] Query completed, found', querySnapshot.size, 'blogs');
      
      const blogs: Blog[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        blogs.push({
          id: doc.id,
          title: data.title,
          excerpt: data.excerpt,
          thumbnail: data.thumbnail,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        });
      });
      
      console.log('[BlogRepository] Processed', blogs.length, 'blogs');
      return blogs;
    } catch (error) {
      console.error('[BlogRepository] Error fetching blogs:', error);
      throw new Error('Failed to fetch blogs');
    }
  }

  async fetchBlogDetail(blogId: string): Promise<{ blog: Blog; content: BlogContent } | null> {
    try {
      console.log('[BlogRepository] fetchBlogDetail called with blogId:', blogId);
      
      // Fetch blog data
      const blogDoc = await getDoc(doc(firestore, 'blogs', blogId));
      console.log('[BlogRepository] blogDoc exists:', blogDoc.exists());
      
      if (!blogDoc.exists()) {
        console.log('[BlogRepository] Blog document not found');
        return null;
      }
      
      const blogData = blogDoc.data();
      console.log('[BlogRepository] blogData:', blogData);
      
      const blog: Blog = {
        id: blogDoc.id,
        title: blogData.title,
        excerpt: blogData.excerpt,
        thumbnail: blogData.thumbnail,
        tags: blogData.tags || [],
        createdAt: blogData.createdAt?.toDate ? blogData.createdAt.toDate().toISOString() : new Date().toISOString(),
      };
      
      // Fetch blog content
      const contentDoc = await getDoc(doc(firestore, 'blogs', blogId, 'content', 'detail'));
      console.log('[BlogRepository] contentDoc exists:', contentDoc.exists());
      
      if (!contentDoc.exists()) {
        console.log('[BlogRepository] Content document not found');
        return null;
      }
      
      const contentData = contentDoc.data();
      console.log('[BlogRepository] contentData:', contentData);
      
      const content: BlogContent = {
        description: contentData.description || '',
        images: contentData.images || [],
        youtubeVideoId: contentData.youtubeVideoId,
      };
      
      console.log('[BlogRepository] Returning blog and content:', { blog, content });
      return { blog, content };
    } catch (error) {
      console.error('[BlogRepository] Error fetching blog detail:', error);
      throw new Error('Failed to fetch blog detail');
    }
  }
}