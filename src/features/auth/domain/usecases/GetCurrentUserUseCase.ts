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

  execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}