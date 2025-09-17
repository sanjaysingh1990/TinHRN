import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../core/application/UseCase';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthRepositoryToken } from '../../tokens';

@injectable()
export class LogoutUseCase implements UseCase<void, Promise<void>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  execute(): Promise<void> {
    return this.authRepository.logout();
  }
}