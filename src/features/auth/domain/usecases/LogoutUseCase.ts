import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../../core/application/UseCase';
import { AuthRepositoryToken } from '../../auth.di';
import { IAuthRepository } from '../repositories/IAuthRepository';

@injectable()
export class LogoutUseCase implements UseCase<void, Promise<void>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  execute(): Promise<void> {
    return this.authRepository.logout();
  }
}