
import { injectable, inject } from 'tsyringe';
import { IProfileRepository } from '../repositories/IProfileRepository';
import { ProfileRepositoryToken } from '../../profile.di';
import { Achievement } from '../models/Achievement';

@injectable()
export class GetAchievementsUseCase {
  constructor(
    @inject(ProfileRepositoryToken) private profileRepository: IProfileRepository
  ) {}

  execute(): Promise<Achievement[]> {
    return this.profileRepository.getAchievements();
  }
}
