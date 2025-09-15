export interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  viewsCount: number;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  postsCount: number;
}

export interface GalleryData {
  featuredPost: Post;
  categories: Category[];
  recentUploads: Post[];
}