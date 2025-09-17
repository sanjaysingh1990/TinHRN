import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../../core/application/UseCase';
import { ProfileRepositoryToken } from '../../profile.di';
import { IProfileRepository } from '../repositories/IProfileRepository';

@injectable()
export class GetUserProfileUseCase implements UseCase<void, Promise<any>> {
  constructor(
    @inject(ProfileRepositoryToken) private profileRepository: IProfileRepository
  ) {}

  execute(): Promise<any> {
    return this.profileRepository.getUserProfile();
  }
}