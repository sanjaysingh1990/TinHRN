import { inject, injectable } from 'tsyringe';
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
}