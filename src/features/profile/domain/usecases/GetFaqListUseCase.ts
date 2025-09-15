import { inject, injectable } from 'tsyringe';
import { ProfileRepositoryToken } from '../../profile.di';
import { Faq } from '../models/Faq';
import { IProfileRepository } from '../repositories/IProfileRepository';

@injectable()
export class GetFaqListUseCase {
  constructor(
    @inject(ProfileRepositoryToken) private profileRepository: IProfileRepository
  ) {}

  execute(): Promise<Faq[]> {
    return this.profileRepository.getFaqList();
  }
}