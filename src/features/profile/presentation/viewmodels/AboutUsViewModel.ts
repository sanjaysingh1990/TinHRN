import { inject, injectable } from 'tsyringe';
import { BaseViewModel } from '../../../../core/presentation/BaseViewModel';
import { AboutUs } from '../../domain/models/AboutUs';
import { TeamMember } from '../../domain/models/TeamMember';
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { ProfileRepositoryToken } from '../../profile.di';

@injectable()
export class AboutUsViewModel extends BaseViewModel {
  private _aboutData: AboutUs | null = null;
  private _teamMembers: TeamMember[] = [];
  private _isLoading = false;

  constructor(
    @inject(ProfileRepositoryToken) private profileRepository: IProfileRepository
  ) {
    super();
  }

  get aboutData(): AboutUs | null {
    return this._aboutData;
  }

  get teamMembers(): TeamMember[] {
    return this._teamMembers;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async loadData(): Promise<void> {
    this._isLoading = true;
    this.notifyUpdate();

    try {
      const [aboutData, teamMembers] = await Promise.all([
        this.profileRepository.getAboutUsData(),
        this.profileRepository.getTeamMembers()
      ]);

      this._aboutData = aboutData;
      this._teamMembers = teamMembers;
    } catch (error) {
      console.error('AboutUsViewModel: Error loading data:', error);
    } finally {
      this._isLoading = false;
      this.notifyUpdate();
    }
  }

  // Deprecated compatibility methods
  async getTeamMembers(): Promise<TeamMember[]> {
    return this.profileRepository.getTeamMembers();
  }

  async getAboutUsData(): Promise<AboutUs> {
    return this.profileRepository.getAboutUsData();
  }
}