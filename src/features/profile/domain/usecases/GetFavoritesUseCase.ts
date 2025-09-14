
import { injectable, inject } from 'tsyringe';
import { IProfileRepository } from '../repositories/IProfileRepository';
import { ProfileRepositoryToken } from '../../profile.di';
import { Favorite } from '../models/Favorite';

@injectable()
export class GetFavoritesUseCase {
  constructor(
    @inject(ProfileRepositoryToken) private profileRepository: IProfileRepository
  ) {}

  execute(): Promise<Favorite[]> {
    return this.profileRepository.getFavorites();
  }
}
