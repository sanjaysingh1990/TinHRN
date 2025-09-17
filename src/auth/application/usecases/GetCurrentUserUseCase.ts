import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../core/application/UseCase';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthRepositoryToken } from '../../tokens';
import { User } from '../../domain/entities/User';

@injectable()
export class GetCurrentUserUseCase implements UseCase<void, Promise<User | null>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}