import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../../core/application/UseCase';
import { AuthRepositoryToken } from '../../auth.di';
import { User } from '../entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';

@injectable()
export class GetCurrentUserUseCase implements UseCase<void, Promise<User | null>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<User | null> {
    console.log('[GetCurrentUserUseCase] execute called');
    try {
      const user = await this.authRepository.getCurrentUser();
      console.log('[GetCurrentUserUseCase] getCurrentUser returned:', user);
      return user;
    } catch (error) {
      console.log('[GetCurrentUserUseCase] Error in execute:', error);
      throw error;
    }
  }
}