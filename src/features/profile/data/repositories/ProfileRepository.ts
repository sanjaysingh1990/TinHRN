import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { container, injectable } from 'tsyringe';
import { AuthRepositoryToken } from '../../../auth/auth.di';
import { IAuthRepository } from '../../../auth/domain/repositories/IAuthRepository';
import { AboutUs } from '../../domain/models/AboutUs';
import { Achievement } from '../../domain/models/Achievement';
import { Faq } from '../../domain/models/Faq';
import { Favorite } from '../../domain/models/Favorite';
import { TeamMember } from '../../domain/models/TeamMember';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';

@injectable()
export class ProfileRepository implements IProfileRepository {
  async getAchievements(): Promise<Achievement[]> {
    // In a real implementation, this would fetch from Firestore
    return [];
  }

  async getFavorites(): Promise<Favorite[]> {
    // In a real implementation, this would fetch from Firestore
    return [];
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    // This is now handled by the AboutUs data
    return [];
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

  async getAboutUsData(): Promise<AboutUs> {
    try {
      const firestore = getFirestore();
      const aboutDoc = await getDoc(doc(firestore, 'aboutUs', 'main'));
      
      if (aboutDoc.exists()) {
        const data = aboutDoc.data();
        console.log('Firebase About Us Data:', data); // Debug log
        
        // Check if data has the expected structure
        const ourMissionData = data.ourMission || data.aboutUs?.ourMission || {};
        const ourTeamData = data.ourTeam || data.aboutUs?.ourTeam || {};
        const teamMembersData = ourTeamData.members || data.members || [];
        
        // Transform team members data to match our model
        const teamMembers = teamMembersData.map((member: any) => ({
          id: member.id || '',
          name: member.name || '',
          title: member.title || member.designation || '',
          phone: member.phone || '',
          email: member.email || '',
          tagline: member.tagline || '',
          description: member.description || '',
          profilePic: member.profilePic || member.image || ''
        }));
        
        return {
          ourMission: {
            heading: ourMissionData.heading || '',
            description: ourMissionData.description || ''
          },
          ourTeam: {
            heading: ourTeamData.heading || '',
            description: ourTeamData.description || '',
            members: teamMembers
          }
        };
      } else {
        console.log('About Us document does not exist, using default data');
        // Return default structure if document doesn't exist
        return this.getDefaultAboutUsData();
      }
    } catch (error) {
      console.error('Error fetching About Us data from Firestore:', error);
      // Return default structure on error
      return this.getDefaultAboutUsData();
    }
  }

  private getDefaultAboutUsData(): AboutUs {
    return {
      ourMission: {
        heading: 'Our Mission',
        description: 'At Tent in Himalayas, our mission is to provide unforgettable adventure experiences in the majestic Himalayas while promoting sustainable and responsible tourism. We believe in connecting people with nature and creating memories that last a lifetime.'
      },
      ourTeam: {
        heading: 'Our Team',
        description: 'Meet the passionate individuals who make our adventures possible. Our team consists of experienced guides, hospitality experts, and nature enthusiasts dedicated to providing you with the best experience in the Himalayas.',
        members: [
          {
            id: '1',
            name: 'Rajesh Kumar',
            title: 'Founder & CEO',
            phone: '+91 9876543210',
            email: 'rajesh@tentinhimalayas.com',
            tagline: 'Adventure Enthusiast',
            description: 'With over 15 years of experience in Himalayan trekking, Rajesh founded Tent in Himalayas to share his passion for the mountains with the world.',
            profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
          },
          {
            id: '2',
            name: 'Priya Sharma',
            title: 'Head Guide',
            phone: '+91 9876543211',
            email: 'priya@tentinhimalayas.com',
            tagline: 'Nature Expert',
            description: 'Priya is a certified mountaineer with expertise in multiple Himalayan regions. She ensures every trek is safe, educational, and enjoyable.',
            profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
          },
          {
            id: '3',
            name: 'Amit Patel',
            title: 'Operations Manager',
            phone: '+91 9876543212',
            email: 'amit@tentinhimalayas.com',
            tagline: 'Logistics Expert',
            description: 'Amit handles all the behind-the-scenes operations to ensure smooth and hassle-free adventures for our guests.',
            profilePic: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
          }
        ]
      }
    };
  }

}
