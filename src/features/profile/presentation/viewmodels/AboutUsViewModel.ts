import { inject, injectable } from 'tsyringe';
import { AboutUs } from '../../domain/models/AboutUs';
import { TeamMember } from '../../domain/models/TeamMember';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { ProfileRepositoryToken } from '../../profile.di';

@injectable()
export class AboutUsViewModel {
  constructor(
    @inject(ProfileRepositoryToken) private profileRepository: IProfileRepository
  ) {}

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      return await this.profileRepository.getTeamMembers();
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  async getAboutUsData(): Promise<AboutUs> {
    try {
      const data = await this.profileRepository.getAboutUsData();
      console.log('AboutUsViewModel: Data received from repository:', data);
      return data;
    } catch (error) {
      console.error('Error fetching About Us data in ViewModel:', error);
      // Return a default structure in case of error
      return {
        ourMission: {
          heading: '',
          description: ''
        },
        ourTeam: {
          heading: '',
          description: '',
          members: []
        }
      };
    }
  }
}