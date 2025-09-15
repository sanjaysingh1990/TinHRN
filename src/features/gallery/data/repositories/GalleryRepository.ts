import { injectable } from 'tsyringe';
import { Category, GalleryData, Post } from '../../domain/entities/Gallery';
import { IGalleryRepository } from '../../domain/repositories/IGalleryRepository';

@injectable()
export class GalleryRepository implements IGalleryRepository {
  private readonly dummyCategories: Category[] = [
    {
      id: '1',
      name: 'Mountains',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      postsCount: 12
    },
    {
      id: '2',
      name: 'Trekking',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=600&fit=crop',
      postsCount: 8
    },
    {
      id: '3',
      name: 'Camping',
      imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=600&fit=crop',
      postsCount: 15
    },
    {
      id: '4',
      name: 'Wildlife',
      imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d040a5d?w=400&h=600&fit=crop',
      postsCount: 6
    },
    {
      id: '5',
      name: 'Adventure',
      imageUrl: 'https://images.unsplash.com/photo-1464822759356-8d6106e78f86?w=400&h=600&fit=crop',
      postsCount: 10
    }
  ];

  private readonly dummyPosts: Post[] = [
    {
      id: '1',
      userName: 'Alex Himalaya',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      title: 'Everest Base Camp Trek',
      description: 'An incredible journey to the base of the world\'s highest mountain. Experience breathtaking views and challenging terrain.',
      category: 'Trekking',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      viewsCount: 2450
    },
    {
      id: '2',
      userName: 'Sarah Explorer',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e3e4?w=100&h=100&fit=crop&crop=face',
      title: 'Annapurna Circuit',
      description: 'Classic Himalayan trek through diverse landscapes and cultures.',
      category: 'Trekking',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
      viewsCount: 1890
    },
    {
      id: '3',
      userName: 'Mike Adventure',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      title: 'High Altitude Camping',
      description: 'Camping under the stars at 4000m elevation.',
      category: 'Camping',
      imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
      viewsCount: 1245
    },
    {
      id: '4',
      userName: 'Emma Mountain',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      title: 'Himalayan Wildlife',
      description: 'Spotted rare snow leopard in Ladakh region.',
      category: 'Wildlife',
      imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d040a5d?w=800&h=600&fit=crop',
      viewsCount: 3200
    },
    {
      id: '5',
      userName: 'John Peak',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      title: 'Sunrise at Kanchenjunga',
      description: 'Golden hour magic at the third highest peak.',
      category: 'Mountains',
      imageUrl: 'https://images.unsplash.com/photo-1464822759356-8d6106e78f86?w=800&h=600&fit=crop',
      viewsCount: 2890
    },
    {
      id: '6',
      userName: 'Lisa Valley',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      title: 'Rhododendron Forest',
      description: 'Blooming rhododendrons in spring season.',
      category: 'Mountains',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      viewsCount: 1567
    },
    {
      id: '7',
      userName: 'David Trail',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      title: 'River Crossing',
      description: 'Adventure river crossing during monsoon trek.',
      category: 'Adventure',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
      viewsCount: 987
    },
    {
      id: '8',
      userName: 'Anna Summit',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e3e4?w=100&h=100&fit=crop&crop=face',
      title: 'Glacier Lake',
      description: 'Crystal clear glacial lake reflection.',
      category: 'Mountains',
      imageUrl: 'https://images.unsplash.com/photo-1464822759356-8d6106e78f86?w=800&h=600&fit=crop',
      viewsCount: 2100
    }
  ];

  async getGalleryData(): Promise<GalleryData> {
    // Simulate 32 second delay as requested
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      featuredPost: this.dummyPosts[0], // First post as featured
      categories: this.dummyCategories,
      recentUploads: this.dummyPosts.slice(1) // Rest as recent uploads
    };
  }

  async getPostById(id: string): Promise<Post> {
    // Small delay for individual post fetch
    await new Promise(resolve => setTimeout(resolve, 1000));

    const post = this.dummyPosts.find(p => p.id === id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return post;
  }
}