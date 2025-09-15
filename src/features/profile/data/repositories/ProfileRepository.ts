
import { injectable } from 'tsyringe';
import { Achievement } from '../../domain/models/Achievement';
import { Favorite } from '../../domain/models/Favorite';
import { TeamMember } from '../../domain/models/TeamMember';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';

const dummyAchievements: Achievement[] = [
  { id: 1, title: 'First Trek', icon: 'hiking', color: 'yellow' },
  { id: 2, title: 'Campfire Pro', icon: 'local_fire_department', color: 'orange' },
  { id: 3, title: 'Peak Bagger', icon: 'area_chart', color: 'cyan' },
  { id: 4, title: 'Photo Master', icon: 'photo_camera', color: 'gray', locked: true },
];

const dummyFavorites: Favorite[] = [
  {
    id: 1,
    title: 'Valley of Flowers',
    location: 'Uttarakhand, India',
    imageUrl: 'https://images.unsplash.com/photo-1542395975-16a58c6b68f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    title: 'Tawang Monastery',
    location: 'Arunachal Pradesh, India',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const dummyTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    designation: 'Lead Trek Guide',
    tagline: 'Passionate mountain explorer with 10+ years experience',
    phone: '+91 98765 43210',
    email: 'arjun@tentinhimalayas.com',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Priya Kumari',
    designation: 'Operations Manager',
    tagline: 'Ensuring seamless adventures for every traveler',
    phone: '+91 98765 43211',
    email: 'priya@tentinhimalayas.com',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    name: 'Rohit Singh',
    designation: 'Safety & Equipment Specialist',
    tagline: 'Your safety is our top priority in the mountains',
    phone: '+91 98765 43212',
    email: 'rohit@tentinhimalayas.com',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: '4',
    name: 'Anjali Patel',
    designation: 'Cultural Experience Coordinator',
    tagline: 'Connecting travelers with authentic local experiences',
    phone: '+91 98765 43213',
    email: 'anjali@tentinhimalayas.com',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: '5',
    name: 'Vikram Thapa',
    designation: 'Photography & Documentation',
    tagline: 'Capturing memories that last a lifetime',
    phone: '+91 98765 43214',
    email: 'vikram@tentinhimalayas.com',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
];

@injectable()
export class ProfileRepository implements IProfileRepository {
  async getAchievements(): Promise<Achievement[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyAchievements);
      }, 5000);
    });
  }

  async getFavorites(): Promise<Favorite[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyFavorites);
      }, 5000);
    });
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyTeamMembers);
      }, 2000); // 2 seconds delay as requested
    });
  }
}
