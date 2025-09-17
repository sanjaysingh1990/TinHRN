
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { container, injectable } from 'tsyringe';
import { AuthRepositoryToken } from '../../../auth/auth.di';
import { IAuthRepository } from '../../../auth/domain/repositories/IAuthRepository';
import { Achievement } from '../../domain/models/Achievement';
import { Faq } from '../../domain/models/Faq';
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
    return dummyAchievements;
  }

  async getFavorites(): Promise<Favorite[]> {
    return dummyFavorites;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return dummyTeamMembers;
  }

  async getFaqList(): Promise<Faq[]> {
    try {
      const firestore = getFirestore();
      const faqCollection = collection(firestore, 'faq');
      const faqSnapshot = await getDocs(faqCollection);
      
      const faqList: Faq[] = [];
      faqSnapshot.forEach((doc) => {
        const data = doc.data();
        faqList.push({
          id: doc.id,
          question: data.question || '',
          answer: data.answer || '',
          category: data.category || ''
        });
      });
      
      return faqList;
    } catch (error) {
      console.error('Error fetching FAQ list from Firestore:', error);
      return []; // Return empty array on error
    }
  }

  async getUserProfile(): Promise<any> {
    try {
      // Get the current user from auth repository
      const authRepository = container.resolve<IAuthRepository>(AuthRepositoryToken);
      const currentUser = await authRepository.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      // Fetch user data from Firestore
      const firestore = getFirestore();
      const userDoc = await getDoc(doc(firestore, 'users', currentUser.id));
      
      if (userDoc.exists()) {
        return { id: currentUser.id, ...userDoc.data() };
      } else {
        // Return basic user info if no additional data in Firestore
        return {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phoneNumber: currentUser.phoneNumber,
          emailVerified: currentUser.emailVerified,
          createdAt: currentUser.createdAt,
          updatedAt: currentUser.updatedAt
        };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}
