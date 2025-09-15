import { injectable, inject } from 'tsyringe';
import { IProfileRepository } from '../repositories/IProfileRepository';
import { ProfileRepositoryToken } from '../../profile.di';
import { Faq } from '../models/Faq';

@injectable()
export class GetFaqListUseCase {
  constructor(
    @inject(ProfileRepositoryToken) private profileRepository: IProfileRepository
  ) {}

  execute(): Promise<Faq[]> {
    return this.profileRepository.getFaqList();
  }
}