
import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../../core/application/UseCase';
import { AuthRepositoryToken } from '../../auth.di';
import { User } from '../entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';

@injectable()
export class LoginUseCase implements UseCase<{ email: string; password: string }, Promise<User>> {
  constructor(
    @inject(AuthRepositoryToken) private authRepository: IAuthRepository
  ) {}

  execute({ email, password }: { email: string; password: string }): Promise<User> {
    return this.authRepository.login(email, password);
  }
}
