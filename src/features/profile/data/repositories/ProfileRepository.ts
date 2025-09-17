
import { doc, getDoc, getFirestore } from 'firebase/firestore';
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

const dummyFaqList: Faq[] = [
  {
    id: '1',
    question: 'What should I pack for a Himalayan trek?',
    answer: 'Essential items include warm clothing (layers), waterproof jacket, sturdy trekking boots, sleeping bag, headlamp, water bottles, first aid kit, sunscreen, sunglasses, and personal medications. We provide a detailed packing list upon booking confirmation.',
    category: 'Preparation'
  },
  {
    id: '2',
    question: 'How difficult are the treks offered?',
    answer: 'Our treks range from beginner-friendly to challenging expeditions. Each trek is rated on difficulty (Easy, Moderate, Difficult, Extreme) based on altitude, duration, terrain, and fitness requirements. We recommend consulting with our team to choose the right trek for your experience level.',
    category: 'Difficulty'
  },
  {
    id: '3',
    question: 'What is included in the trek package?',
    answer: 'Our packages typically include accommodation (tents/guesthouses), meals during the trek, experienced guides, permits, transportation to/from trek starting point, and safety equipment. Specific inclusions vary by trek - check individual trek details for complete information.',
    category: 'Packages'
  },
  {
    id: '4',
    question: 'What happens in case of bad weather?',
    answer: 'Safety is our top priority. In case of severe weather conditions, our experienced guides may modify the itinerary, take alternative routes, or in extreme cases, arrange early return. Weather contingency plans are discussed during the pre-trek briefing.',
    category: 'Safety'
  },
  {
    id: '5',
    question: 'Do you provide travel insurance?',
    answer: 'We strongly recommend comprehensive travel insurance that covers high-altitude trekking, emergency evacuation, and medical expenses. While we don\'t directly provide insurance, we can recommend trusted providers and help you understand coverage requirements.',
    category: 'Insurance'
  },
  {
    id: '6',
    question: 'Can beginners join the treks?',
    answer: 'Absolutely! We offer beginner-friendly treks with proper acclimatization schedules and experienced guides. We recommend starting with shorter, lower-altitude treks to build experience and confidence before attempting more challenging routes.',
    category: 'Experience'
  },
  {
    id: '7',
    question: 'What about altitude sickness?',
    answer: 'Our itineraries include proper acclimatization days. Our guides are trained to recognize altitude sickness symptoms and carry necessary medications. We follow gradual ascent protocols and have evacuation procedures in place for emergencies.',
    category: 'Health'
  },
  {
    id: '8',
    question: 'How do I cancel or reschedule my booking?',
    answer: 'Cancellation and rescheduling policies vary by trek and timing. Generally, cancellations made 30+ days in advance receive partial refunds. Emergency cancellations are handled case-by-case. Please refer to our terms and conditions or contact our support team.',
    category: 'Booking'
  }
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

  async getFaqList(): Promise<Faq[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dummyFaqList);
      }, 2500); // 2.5 seconds delay as requested
    });
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
